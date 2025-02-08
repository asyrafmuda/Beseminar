import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Download, Search, LogOut } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  abo_number: string;
  group_type: string;
  referral_name: string;
  diamond_name: string;
  created_at: string;
}

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };

    checkAuth();
    fetchBookings();
  }, [navigate]);

  useEffect(() => {
    const filtered = bookings.filter(booking => 
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.abo_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return;
    }

    setBookings(data || []);
    setFilteredBookings(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Business Expansion Seminar 11.0 - Bookings Report', 14, 15);
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

    // Create table
    const tableColumn = ["Name", "Email", "Phone", "ABO Number", "Group Type", "Referral", "Diamond", "Date"];
    const tableRows = filteredBookings.map(booking => [
      booking.name,
      booking.email,
      booking.phone,
      booking.abo_number || '-',
      booking.group_type || '-',
      booking.referral_name || '-',
      booking.diamond_name || '-',
      new Date(booking.created_at).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [218, 165, 32] },
    });

    doc.save('bookings-report.pdf');
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-amber-800">Business Expansion Seminar 11.0</h1>
            <p className="text-amber-600 mt-2">Booking Management Dashboard</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or ABO number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-100">
                <tr>
                  <th className="px-6 py-3 text-left text-amber-800">Name</th>
                  <th className="px-6 py-3 text-left text-amber-800">Email</th>
                  <th className="px-6 py-3 text-left text-amber-800">Phone</th>
                  <th className="px-6 py-3 text-left text-amber-800">ABO Number</th>
                  <th className="px-6 py-3 text-left text-amber-800">Group Type</th>
                  <th className="px-6 py-3 text-left text-amber-800">Referral</th>
                  <th className="px-6 py-3 text-left text-amber-800">Diamond</th>
                  <th className="px-6 py-3 text-left text-amber-800">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-amber-50">
                    <td className="px-6 py-4">{booking.name}</td>
                    <td className="px-6 py-4">{booking.email}</td>
                    <td className="px-6 py-4">{booking.phone}</td>
                    <td className="px-6 py-4">{booking.abo_number || '-'}</td>
                    <td className="px-6 py-4">{booking.group_type || '-'}</td>
                    <td className="px-6 py-4">{booking.referral_name || '-'}</td>
                    <td className="px-6 py-4">{booking.diamond_name || '-'}</td>
                    <td className="px-6 py-4">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}