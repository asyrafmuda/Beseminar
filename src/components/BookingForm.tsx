import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface ParticipantData {
  name: string;
  email: string;
  phone: string;
  abo_number: string;
  group_type: string;
  referral_name: string;
  diamond_name: string;
}

const initialParticipantData: ParticipantData = {
  name: '',
  email: '',
  phone: '',
  abo_number: '',
  group_type: '',
  referral_name: '',
  diamond_name: '',
};

const GROUP_TYPES = ['L&G', 'HAN', 'CTN'];

export default function BookingForm() {
  const [participants, setParticipants] = useState<ParticipantData[]>([{ ...initialParticipantData }]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { ...initialParticipantData }]);
  };

  const handleParticipantChange = (index: number, field: keyof ParticipantData, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setParticipants(newParticipants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      for (const participant of participants) {
        const { error } = await supabase.from('bookings').insert([{
          name: participant.name,
          email: participant.email,
          phone: participant.phone,
          abo_number: participant.abo_number,
          group_type: participant.group_type,
          referral_name: participant.referral_name,
          diamond_name: participant.diamond_name
        }]);
        if (error) throw error;
      }
      
      toast.custom((t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col p-6`}>
          <div className="text-center">
            <h3 className="text-lg font-medium text-amber-800 mb-2">Booking Successful!</h3>
            <p className="text-sm text-gray-600">
              Thank you for registering for Business Expansion Seminar 11.0!
              We look forward to seeing you there.
            </p>
          </div>
        </div>
      ), {
        duration: 4000,
        position: 'top-center',
      });
      
      setParticipants([{ ...initialParticipantData }]);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto p-4">
        <img
          src="https://app.cse.my/storage/images/events/V6OxTfVUNL14omKaDsip9HRAs6U9bDnXxc73k8gA.png"
          alt="Business Expansion Seminar"
          className="w-full rounded-lg shadow-lg mb-8"
        />

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-amber-800 mb-6">Business Expansion Seminar 11.0</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-amber-700">
              <CalendarDays className="w-5 h-5 mr-2" />
              <span>September 13, 2025 - September 14, 2025</span>
            </div>
            <div className="flex items-center text-amber-700">
              <Clock className="w-5 h-5 mr-2" />
              <span>1:45 PM - 4:30 PM</span>
            </div>
            <div className="flex items-center text-amber-700">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Bangi Avenue Convention Centre (BACC)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {participants.map((participant, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-amber-800 mb-4">
                  Participant {index + 1}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-amber-700 mb-1">Name *</label>
                    <input
                      required
                      type="text"
                      value={participant.name}
                      onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-700 mb-1">Email *</label>
                    <input
                      required
                      type="email"
                      value={participant.email}
                      onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-700 mb-1">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={participant.phone}
                      onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-700 mb-1">ABO Number (If have)</label>
                    <input
                      type="text"
                      value={participant.abo_number}
                      onChange={(e) => handleParticipantChange(index, 'abo_number', e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-700 mb-1">Group Type</label>
                    <select
                      value={participant.group_type}
                      onChange={(e) => handleParticipantChange(index, 'group_type', e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    >
                      <option value="">Select Group Type</option>
                      {GROUP_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-amber-700 mb-1">Referral Name (If have)</label>
                    <input
                      type="text"
                      value={participant.referral_name}
                      onChange={(e) => handleParticipantChange(index, 'referral_name', e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-700 mb-1">Diamond Name (If have)</label>
                    <input
                      type="text"
                      value={participant.diamond_name}
                      onChange={(e) => handleParticipantChange(index, 'diamond_name', e.target.value)}
                      className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleAddParticipant}
                className="w-full py-2 px-4 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
              >
                Add More Participant
              </button>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}