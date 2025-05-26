import React, { useEffect, useState } from 'react';
import { AppointmentCard } from './components/AppointmentCard';
import { FollowUpModal } from './components/FollowUpModal';
import { supabase } from './lib/supabase';
import { Appointment, Patient, Doctor } from './types';
import { toast, Toaster } from 'react-hot-toast';

function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [doctors, setDoctors] = useState<Record<string, Doctor>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (appointmentsError) throw appointmentsError;

      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*');

      if (patientsError) throw patientsError;

      // Fetch doctors
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctors')
        .select('*');

      if (doctorsError) throw doctorsError;

      setAppointments(appointmentsData);
      setPatients(
        patientsData.reduce((acc, patient) => ({
          ...acc,
          [patient.id]: patient,
        }), {})
      );
      setDoctors(
        doctorsData.reduce((acc, doctor) => ({
          ...acc,
          [doctor.id]: doctor,
        }), {})
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load appointments');
    }
  };

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.map(apt =>
        apt.id === id ? { ...apt, status } : apt
      ));

      toast.success('Appointment status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const handleFollowUp = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleFollowUpSubmit = async (date: string, notes: string) => {
    if (!selectedAppointment) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_id: selectedAppointment.patient_id,
            doctor_id: selectedAppointment.doctor_id,
            appointment_date: date,
            notes,
            status: 'scheduled',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setAppointments([...appointments, data]);
      setIsModalOpen(false);
      toast.success('Follow-up appointment scheduled');
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      toast.error('Failed to schedule follow-up appointment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Patient Follow-up Management
          </h1>

          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                patient={patients[appointment.patient_id]}
                doctor={doctors[appointment.doctor_id]}
                onStatusChange={handleStatusChange}
                onFollowUp={handleFollowUp}
              />
            ))}
          </div>
        </div>
      </div>

      <FollowUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFollowUpSubmit}
        appointment={selectedAppointment}
      />
    </div>
  );
}

export default App;