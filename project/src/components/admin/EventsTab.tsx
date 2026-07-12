import React, { useState } from 'react';
import { Trash2, Plus, RefreshCw, MapPin } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date?: string;
    location: string;
    category: string;
    price: string;
    source: string;
    ticket_url?: string;
    mood?: string;
    highlights?: string;
    image_url: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const EventsTab: React.FC<{ events: Event[], onUpdate: () => void, token: string | null }> = ({ events, onUpdate, token }) => {
    const [showAdd, setShowAdd] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        category: 'Party',
        price: '',
        ticket_url: '',
        mood: '',
        highlights: '',
        image_url: ''
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/admin/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newEvent)
            });
            if (res.ok) {
                setShowAdd(false);
                setNewEvent({ title: '', description: '', start_date: '', end_date: '', location: '', category: 'Party', price: '', ticket_url: '', mood: '', highlights: '', image_url: '' });
                onUpdate();
            } else {
                alert('Failed to create event');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ... (rest of handlers kept same, implied)
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            await fetch(`${API_BASE_URL}/admin/events/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            onUpdate();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/admin/events/sync`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            alert(data.message);
            onUpdate();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* ... (header kept same) */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Events Management</h3>
                <div className="flex space-x-3">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                        <span>{isSyncing ? 'Syncing...' : 'Sync Google Events'}</span>
                    </button>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <Plus size={18} />
                        <span>Add Event</span>
                    </button>
                </div>
            </div>

            {/* Add Event Form */}
            {showAdd && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ... (other fields kept same) */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Event Title</label>
                            <input
                                type="text"
                                required
                                value={newEvent.title}
                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={newEvent.description}
                                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="datetime-local"
                                required
                                value={newEvent.start_date}
                                onChange={e => setNewEvent({ ...newEvent, start_date: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="datetime-local"
                                value={newEvent.end_date}
                                onChange={e => setNewEvent({ ...newEvent, end_date: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                required
                                value={newEvent.location}
                                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={newEvent.category}
                                onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            >
                                {['Party', 'Music', 'Cultural', 'Food', 'Nightlife', 'Other'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="text"
                                placeholder="Free, ₹500, etc."
                                value={newEvent.price}
                                onChange={e => setNewEvent({ ...newEvent, price: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ticket/Booking URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newEvent.ticket_url}
                                onChange={e => setNewEvent({ ...newEvent, ticket_url: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mood / Vibe</label>
                            <input
                                type="text"
                                placeholder="e.g. Electric, Chill, Romantic"
                                value={newEvent.mood}
                                onChange={e => setNewEvent({ ...newEvent, mood: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Highlights (JSON format)</label>
                            <input
                                type="text"
                                placeholder='["Live Music", "Free Drinks"]'
                                value={newEvent.highlights}
                                onChange={e => setNewEvent({ ...newEvent, highlights: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter a JSON array of strings for bullet points.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={newEvent.image_url}
                                onChange={e => setNewEvent({ ...newEvent, image_url: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        </div>
                        <div className="col-span-2 flex justify-end space-x-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowAdd(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* ... (table display, can verify later if ticket_url needs to be shown, but form is most critical) */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Date', 'Title', 'Location', 'Category', 'Source', 'Actions'].map(h => (
                                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(event.start_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    <div className="flex items-center">
                                        {event.image_url && <img src={event.image_url} alt="" className="h-8 w-8 rounded mr-2 object-cover" />}
                                        <div>
                                            {event.title}
                                            {event.ticket_url && <span className="block text-xs text-blue-500 truncate max-w-[150px]">{event.ticket_url}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {event.location}
                                    </div>
                                </td>
                                {/* ... (rest of cells) */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {event.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded text-xs ${event.source === 'manual' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                        {event.source}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {events.length === 0 && <div className="p-8 text-center text-gray-500">No events found. Add one manually or sync from Ticketmaster.</div>}
            </div>
        </div>
    );
};
