
import { useEffect, useState } from 'react';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();
type TransportOrder = Schema['models']['transportOrder']['type'];

function App() {
  const [orders, setOrders] = useState<TransportOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ vin: '', plant: '', port: '' });
  const [statusUpdate, setStatusUpdate] = useState<{ id: string; status: string }>({ id: '', status: '' });
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  useEffect(() => {
    setLoading(true);
    client.models.transportOrder.list().then(({ data }) => {
      setOrders(data ?? []);
      setLoading(false);
    });
  }, []);

  // Create new order
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await client.models.transportOrder.create(form);
      setForm({ vin: '', plant: '', port: '' });
      // Refresh list
      const { data } = await client.models.transportOrder.list();
      setOrders(data ?? []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    }
  };

  // Update order status (using model update)
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await client.models.transportOrder.update({ id: statusUpdate.id, status: statusUpdate.status });
      setStatusUpdate({ id: '', status: '' });
      // Refresh list
      const { data } = await client.models.transportOrder.list();
      setOrders(data ?? []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    }
  };

  return (
    <div className="transport-orders-container">
      <h1>Transport Orders</h1>
      {error && <div className="error-message">{error}</div>}
      <h2>Create New Order</h2>
      <form onSubmit={handleCreate} className="order-form">
        <input
          placeholder="VIN"
          value={form.vin}
          onChange={e => setForm(f => ({ ...f, vin: e.target.value }))}
          required
        />
        <input
          placeholder="Plant"
          value={form.plant}
          onChange={e => setForm(f => ({ ...f, plant: e.target.value }))}
          required
        />
        <input
          placeholder="Port"
          value={form.port}
          onChange={e => setForm(f => ({ ...f, port: e.target.value }))}
          required
        />
        <button type="submit">Create</button>
      </form>

      <h2>Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="orders-table" border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>ID</th>
              <th>VIN</th>
              <th>Plant</th>
              <th>Port</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.vin}</td>
                <td>{order.plant}</td>
                <td>{order.port}</td>
                <td>{order.status}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Update Order Status</h2>
      <form onSubmit={handleStatusUpdate} className="status-form">
        <input
          placeholder="Order ID"
          value={statusUpdate.id}
          onChange={e => setStatusUpdate(s => ({ ...s, id: e.target.value }))}
          required
        />
        <select
          value={statusUpdate.status}
          onChange={e => setStatusUpdate(s => ({ ...s, status: e.target.value }))}
          required
          title="Order Status"
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
        <button type="submit">Update Status</button>
      </form>
    </div>
  );
}

export default App;
