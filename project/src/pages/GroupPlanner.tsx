import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Share2, 
  CheckCircle2, 
  Plus, 
  ThumbsUp, 
  ThumbsDown, 
  DollarSign, 
  Calendar, 
  MapPin, 
  PieChart, 
  CheckSquare, 
  Sparkles,
  Radio,
  LogIn
} from 'lucide-react';
import toast from 'react-hot-toast';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'leader' | 'member';
}

interface PollActivity {
  id: string;
  title: string;
  category: string;
  costPerHead: number;
  location: string;
  upvotes: string[]; // member IDs
  downvotes: string[];
  proposedBy: string;
  confirmed: boolean;
  day: number;
}

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
}

const INITIAL_MEMBERS: GroupMember[] = [
  { id: 'm1', name: 'Sahil (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', role: 'leader' },
  { id: 'm2', name: 'Rahul M.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'member' },
  { id: 'm3', name: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'member' },
  { id: 'm4', name: 'Vikram S.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'member' }
];

export const GroupPlanner: React.FC = () => {
  const [tripCode, setTripCode] = useState('GOA-GANG-9842');
  const [inputCode, setInputCode] = useState('');
  const [tripName, setTripName] = useState('Goa Summer Beach & Sunset Reunion 🌴');
  const [activeTab, setActiveTab] = useState<'polls' | 'itinerary' | 'expenses' | 'checklist'>('polls');

  const [members, setMembers] = useState<GroupMember[]>(INITIAL_MEMBERS);
  const [polls, setPolls] = useState<PollActivity[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Member Profile & Add Member Modal State
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  // New Proposal Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Beach & Chill');
  const [newCost, setNewCost] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDay, setNewDay] = useState(1);

  // Expense Form State
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePayer, setExpensePayer] = useState('Sahil (You)');

  // Checklist New Item
  const [newCheckItem, setNewCheckItem] = useState('');

  const currentUserId = 'm1'; // You

  // Real-time backend API synchronization hook (polls backend every 3s)
  useEffect(() => {
    let isMounted = true;

    const fetchRealtimeTripData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/group/${tripCode}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data) {
          setTripName(data.name || `Goa Trip Squad (${data.code})`);
          if (Array.isArray(data.members)) setMembers(data.members);
          if (Array.isArray(data.polls)) setPolls(data.polls);
          if (Array.isArray(data.expenses)) setExpenses(data.expenses);
          if (Array.isArray(data.checklist)) setChecklist(data.checklist);
          setIsLiveConnected(true);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        if (isMounted) setIsLiveConnected(false);
      }
    };

    fetchRealtimeTripData();
    const interval = setInterval(fetchRealtimeTripData, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [tripCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`http://localhost:5173/group-planner?code=${tripCode}`);
    toast.success(`Invite Link for ${tripCode} copied to clipboard!`);
  };

  const handleSwitchTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const cleanCode = inputCode.trim().toUpperCase();
    setTripCode(cleanCode);
    setInputCode('');
    toast.success(`Joined live trip room: ${cleanCode}`);
  };

  const handleCreateNewTrip = async () => {
    const fallbackCode = 'GOA-GROUP-' + Math.floor(1000 + Math.random() * 9000);
    try {
      const res = await fetch('http://localhost:5000/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Goa Squad Trip 🌴', leaderName: 'Sahil (You)' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.code) {
          setTripCode(data.code);
          toast.success(`Created new live trip room ${data.code}!`);
          return;
        }
      }
    } catch (err) {}

    // Guaranteed fallback
    setTripCode(fallbackCode);
    toast.success(`Created new trip room ${fallbackCode}!`);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const name = newMemberName.trim();
    const newM: GroupMember = {
      id: 'm-' + Date.now(),
      name,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      role: 'member'
    };

    setMembers(prev => [...prev, newM]);
    setShowAddMemberModal(false);
    setNewMemberName('');
    toast.success(`Added ${name} to squad!`);

    try {
      const res = await fetch(`http://localhost:5000/api/group/${tripCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setMembers(data.trip.members);
      }
    } catch (err) {}
  };

  // Real-time Upvote / Downvote Toggle
  const handleVote = async (pollId: string, type: 'up' | 'down') => {
    try {
      const res = await fetch(`http://localhost:5000/api/group/${tripCode}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, userId: currentUserId, voteType: type })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setPolls(data.trip.polls);
      }
    } catch (err) {
      // Optimistic local fallback
      setPolls(prev => prev.map(p => {
        if (p.id !== pollId) return p;
        let upvotes = [...p.upvotes];
        let downvotes = [...p.downvotes];
        if (type === 'up') {
          upvotes = upvotes.includes(currentUserId) ? upvotes.filter(id => id !== currentUserId) : [...upvotes, currentUserId];
          downvotes = downvotes.filter(id => id !== currentUserId);
        } else {
          downvotes = downvotes.includes(currentUserId) ? downvotes.filter(id => id !== currentUserId) : [...downvotes, currentUserId];
          upvotes = upvotes.filter(id => id !== currentUserId);
        }
        return { ...p, upvotes, downvotes };
      }));
    }
  };

  // Toggle Activity Confirmation for Itinerary
  const toggleConfirmActivity = async (pollId: string) => {
    const targetPoll = polls.find(p => p.id === pollId);
    const isNowConfirmed = targetPoll ? !targetPoll.confirmed : true;

    // Instant optimistic update
    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, confirmed: !p.confirmed } : p));
    if (isNowConfirmed) {
      toast.success(`Added "${targetPoll?.title || 'Activity'}" to Day ${targetPoll?.day || 1} Itinerary! 📅`);
    } else {
      toast.success(`Removed "${targetPoll?.title || 'Activity'}" from Itinerary.`);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/group/${tripCode}/confirm-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setPolls(data.trip.polls);
      }
    } catch (err) {}
  };

  // Submit New Proposal
  const handleAddProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newPoll: PollActivity = {
      id: 'p-' + Date.now(),
      title: newTitle,
      category: newCategory,
      costPerHead: Number(newCost) || 0,
      location: newLocation || 'Goa Coast',
      upvotes: [currentUserId],
      downvotes: [],
      proposedBy: 'Sahil (You)',
      confirmed: false, // Default to unconfirmed until manually selected for itinerary
      day: Number(newDay) || 1
    };

    // Instant local optimistic update
    setPolls(prev => [newPoll, ...prev]);
    setShowAddModal(false);
    setNewTitle('');
    setNewCost('');
    setNewLocation('');
    toast.success(`Proposed "${newTitle}" for squad voting! Click "+ Add to Itinerary" when ready.`);

    try {
      const res = await fetch(`http://localhost:5000/api/group/${tripCode}/propose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          costPerHead: Number(newCost) || 0,
          location: newLocation || 'Goa Coast',
          day: Number(newDay),
          proposedBy: 'Sahil (You)',
          confirmed: false
        })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setPolls(data.trip.polls);
      }
    } catch (err) {}
  };

  // Expense Add
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmount) return;

    try {
      const res = await fetch(`http://localhost:5000/api/group/${tripCode}/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: expenseDesc,
          amount: Number(expenseAmount),
          paidBy: expensePayer
        })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setExpenses(data.trip.expenses);
        setExpenseDesc('');
        setExpenseAmount('');
        toast.success('Expense recorded & split live!');
      }
    } catch (err) {
      toast.error('Failed to save expense');
    }
  };

  // Expense Calculation Stats
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPersonShare = Math.round(totalExpense / (members.length || 1));

  const balances: Record<string, number> = {};
  members.forEach(m => { balances[m.name] = 0; });
  expenses.forEach(e => {
    balances[e.paidBy] = (balances[e.paidBy] || 0) + e.amount;
  });

  // Checklist toggle & add
  const toggleChecklist = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/group/${tripCode}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', itemId: id })
      });
      const data = await res.json();
      if (data.success && data.trip) setChecklist(data.trip.checklist);
    } catch (err) {
      setChecklist(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
    }
  };

  const addChecklistItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckItem) return;

    try {
      const res = await fetch(`http://localhost:5000/api/group/${tripCode}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', text: newCheckItem, assignedTo: 'Sahil (You)' })
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setChecklist(data.trip.checklist);
        setNewCheckItem('');
        toast.success('Added item to squad checklist!');
      }
    } catch (err) {
      toast.error('Failed to add checklist item');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Live Trip Code Switcher Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Radio className={`h-4 w-4 ${isLiveConnected ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-bold">
              {isLiveConnected ? 'Real-time Backend Sync Active' : 'Connecting to Realtime Server...'}
            </span>
            <span className="text-slate-400">• Last synced {lastSyncTime}</span>
          </div>

          <form onSubmit={handleSwitchTrip} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter Trip Code (e.g. GOA-GANG-9842)"
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="btn-secondary !px-3 !py-1.5 !text-xs">
              <LogIn className="h-3.5 w-3.5" /> Join Room
            </button>
            <button
              type="button"
              onClick={handleCreateNewTrip}
              className="btn-primary !px-3 !py-1.5 !text-xs shrink-0"
            >
              + Create New Trip
            </button>
          </form>
        </div>

        {/* Header Trip Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  🗳️ REALTIME GROUP PLANNER
                </span>
                <span className="text-xs text-slate-400 font-medium">Trip Room Code: <b className="text-blue-600 dark:text-blue-400">{tripCode}</b></span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                {tripName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-4 w-4 text-blue-500" /> 3 Days in Goa
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="h-4 w-4 text-emerald-500" /> {members.length} Squad Members Online
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <PieChart className="h-4 w-4 text-amber-500" /> Live Group Spend: ₹{totalExpense.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Members Avatars & Invite Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center -space-x-2.5">
                {members.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMember(m)}
                    className="relative group transition-all duration-200 hover:scale-115 hover:z-30 focus:outline-none"
                    title={`Click to view ${m.name}'s profile & activity history`}
                  >
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-sm ring-2 ring-transparent group-hover:ring-blue-500 transition-all"
                    />
                  </button>
                ))}

                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-extrabold shadow-sm transition-all hover:scale-110 shrink-0"
                  title="Add new member to squad"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="btn-primary !px-5 !py-2.5 !text-sm flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" /> Share Invite Link
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('polls')}
            className={`chip-button ${activeTab === 'polls' ? 'chip-button-active' : 'chip-button-inactive'}`}
          >
            <ThumbsUp className="h-4 w-4" /> Activity Voting Polls ({polls.length})
          </button>

          <button
            onClick={() => setActiveTab('itinerary')}
            className={`chip-button ${activeTab === 'itinerary' ? 'chip-button-active' : 'chip-button-inactive'}`}
          >
            <Calendar className="h-4 w-4" /> Group Itinerary ({polls.filter(p => p.confirmed).length} Confirmed)
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`chip-button ${activeTab === 'expenses' ? 'chip-button-active' : 'chip-button-inactive'}`}
          >
            <DollarSign className="h-4 w-4" /> Splitwise Bill Splitter (₹{totalExpense})
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`chip-button ${activeTab === 'checklist' ? 'chip-button-active' : 'chip-button-inactive'}`}
          >
            <CheckSquare className="h-4 w-4" /> Trip Checklist ({checklist.filter(c => c.completed).length}/{checklist.length})
          </button>
        </div>

        {/* TAB 1: ACTIVITY VOTING POLLS */}
        {activeTab === 'polls' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Group Activity Proposals & Votes</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Vote on proposed activities or add your own ideas for the squad!</p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary !px-4 !py-2 !text-sm"
              >
                <Plus className="h-4 w-4" /> Propose New Activity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {polls.map(poll => {
                const totalVotes = poll.upvotes.length + poll.downvotes.length;
                const upPercentage = totalVotes > 0 ? Math.round((poll.upvotes.length / totalVotes) * 100) : 0;
                const hasUpvoted = poll.upvotes.includes(currentUserId);
                const hasDownvoted = poll.downvotes.includes(currentUserId);

                return (
                  <div key={poll.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {poll.category} • Day {poll.day}
                        </span>

                        <button
                          onClick={() => toggleConfirmActivity(poll.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                            poll.confirmed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {poll.confirmed ? 'Confirmed in Itinerary' : '+ Add to Itinerary'}
                        </button>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{poll.title}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-blue-500" /> {poll.location}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                          ₹{poll.costPerHead} / head
                        </span>
                        <span>Proposed by: <b>{poll.proposedBy}</b></span>
                      </div>

                      {/* Vote Progress Bar */}
                      <div className="space-y-1.5 mb-5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-emerald-600 dark:text-emerald-400">{poll.upvotes.length} Votes Yes ({upPercentage}%)</span>
                          <span className="text-slate-400">{poll.downvotes.length} Votes No</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div style={{ width: `${upPercentage}%` }} className="bg-emerald-500 transition-all duration-500" />
                          <div style={{ width: `${100 - upPercentage}%` }} className="bg-slate-300 dark:bg-slate-700 transition-all duration-500" />
                        </div>
                      </div>
                    </div>

                    {/* Vote Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Cast your vote:</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(poll.id, 'up')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            hasUpvoted
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100'
                          }`}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" /> Yes ({poll.upvotes.length})
                        </button>

                        <button
                          onClick={() => handleVote(poll.id, 'down')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            hasDownvoted
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100'
                          }`}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" /> No ({poll.downvotes.length})
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-1">Confirmed Group Itinerary</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Activities voted and confirmed by the squad.</p>

            {[1, 2, 3].map(dayNum => {
              const dayActivities = polls.filter(p => Boolean(p.confirmed) && Number(p.day) === Number(dayNum));
              return (
                <div key={dayNum} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      D{dayNum}
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Day {dayNum} Schedule</h3>
                  </div>

                  {dayActivities.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 text-xs italic">
                      No activities confirmed for Day {dayNum} yet. Vote on proposed activities in the Voting tab!
                    </div>
                  ) : (
                    <div className="space-y-3 pl-4 border-l-2 border-blue-200 dark:border-slate-800 ml-4">
                      {dayActivities.map(act => (
                        <div key={act.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{act.category}</span>
                            <h4 className="font-bold text-slate-900 dark:text-white">{act.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{act.location}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white">₹{act.costPerHead}</span>
                            <span className="text-xs text-slate-400 block">per head</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: EXPENSE SPLITTER */}
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Add Expense Form */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Record Group Expense (Splitwise Style)</h3>
                <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Expense Description (e.g. Scooter Fuel)"
                    value={expenseDesc}
                    onChange={e => setExpenseDesc(e.target.value)}
                    className="input-field sm:col-span-1"
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={expenseAmount}
                    onChange={e => setExpenseAmount(e.target.value)}
                    className="input-field"
                  />
                  <select
                    value={expensePayer}
                    onChange={e => setExpensePayer(e.target.value)}
                    className="input-field"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn-primary sm:col-span-3 !py-2.5">
                    + Add Expense & Split Equally
                  </button>
                </form>
              </div>

              {/* Expense History List */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Group Expense History</h3>
                <div className="space-y-3">
                  {expenses.map(exp => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">{exp.description}</div>
                        <div className="text-xs text-slate-400">Paid by <b className="text-slate-700 dark:text-slate-300">{exp.paidBy}</b> on {exp.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400">₹{exp.amount.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-400">Split by {members.length} = ₹{Math.round(exp.amount / (members.length || 1))} ea</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expense Balance Settlement Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-fit">
              <h3 className="text-lg font-bold mb-1">Squad Settlement Summary</h3>
              <p className="text-xs text-slate-400 mb-6">Equal Share: <b>₹{perPersonShare.toLocaleString()} / person</b></p>

              <div className="space-y-3">
                {members.map(m => {
                  const paid = balances[m.name] || 0;
                  const diff = paid - perPersonShare;
                  return (
                    <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="font-bold">{m.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">Paid ₹{paid}</div>
                        <div className={`font-semibold ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {diff >= 0 ? `Gets back ₹${diff}` : `Owes ₹${Math.abs(diff)}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Goa Trip Preparation Checklist</h2>

            <form onSubmit={addChecklistItem} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Add item (e.g. Carry ISI Helmets, DL, Towels)..."
                value={newCheckItem}
                onChange={e => setNewCheckItem(e.target.value)}
                className="input-field"
              />
              <button type="submit" className="btn-primary shrink-0 !py-2.5">Add Item</button>
            </form>

            <div className="space-y-3">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    item.completed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-slate-500 line-through'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-400'
                    }`}>
                      {item.completed && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span className="font-semibold text-sm">{item.text}</span>
                  </div>
                  {item.assignedTo && <span className="text-xs text-slate-400 font-medium">{item.assignedTo}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Propose New Activity */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-4">Propose Activity to Squad</h3>

              <form onSubmit={handleAddProposal} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold mb-1">Activity Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Tito's Lane Pub Crawl"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="Beach & Chill">Beach & Chill</option>
                    <option value="Water Sports">Water Sports</option>
                    <option value="Nightlife">Nightlife</option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Sightseeing">Sightseeing</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Cost / Head (₹)</label>
                    <input
                      type="number"
                      placeholder="1500"
                      value={newCost}
                      onChange={e => setNewCost(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Planned Day</label>
                    <select
                      value={newDay}
                      onChange={e => setNewDay(Number(e.target.value))}
                      className="input-field"
                    >
                      <option value={1}>Day 1</option>
                      <option value={2}>Day 2</option>
                      <option value={3}>Day 3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Baga Beach, North Goa"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary w-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Squad Member Profile */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-lg"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-16 h-16 rounded-full border-4 border-blue-500 object-cover shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedMember.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {selectedMember.role === 'leader' ? '👑 Leader' : '👥 Member'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Active Squad Traveler • Room {tripCode}</p>
                </div>
              </div>

              {/* Financial Stats */}
              {(() => {
                const paid = balances[selectedMember.name] || 0;
                const diff = paid - perPersonShare;
                return (
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Paid</div>
                      <div className="text-lg font-extrabold text-slate-900 dark:text-white">₹{paid.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold uppercase">Balance Status</div>
                      <div className={`text-sm font-extrabold ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {diff >= 0 ? `Gets back ₹${diff}` : `Owes ₹${Math.abs(diff)}`}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Proposals by Member */}
              <div className="mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Activities Proposed</h4>
                {polls.filter(p => p.proposedBy.toLowerCase().includes(selectedMember.name.split(' ')[0].toLowerCase())).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No activities proposed by {selectedMember.name} yet.</p>
                ) : (
                  <div className="space-y-2">
                    {polls
                      .filter(p => p.proposedBy.toLowerCase().includes(selectedMember.name.split(' ')[0].toLowerCase()))
                      .map(p => (
                        <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
                          <span className="font-bold">{p.title}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">₹{p.costPerHead}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Checklist Items Assigned */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Checklist Tasks</h4>
                {checklist.filter(c => (c.assignedTo || '').toLowerCase().includes(selectedMember.name.split(' ')[0].toLowerCase())).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No checklist tasks assigned yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {checklist
                      .filter(c => (c.assignedTo || '').toLowerCase().includes(selectedMember.name.split(' ')[0].toLowerCase()))
                      .map(c => (
                        <div key={c.id} className="text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${c.completed ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span className={c.completed ? 'line-through text-slate-400' : ''}>{c.text}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="btn-primary w-full mt-6 !py-2.5"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

        {/* Modal: Add Squad Member */}
        {showAddMemberModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold mb-4">Add Member to Squad</h3>

              <form onSubmit={handleAddMember} className="space-y-4 text-sm">
                <div>
                  <label className="block font-semibold mb-1">Squad Member Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya S., Rohan M."
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="btn-secondary w-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Add to Squad
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPlanner;
