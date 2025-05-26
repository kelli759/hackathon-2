import React from 'react';
import { format } from 'date-fns';
import { Appointment, Patient, Doctor } from '../types';

interface AppointmentCardProps {
  appointment: Appointment;
  patient: Patient;
  doctor: Doctor;
  onStatusChange: (id: string, status: Appointment['status']) => void;
  onFollowUp: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  patient,
  doctor,
  onStatusChange,
  onFollowUp,
}) => {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            {patient.first_name} {patient.last_name}
          </h3>
          <p className="text-gray-600">
            Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialty}
          </p>
          <p className="text-gray-500 mt-2">
            {format(new Date(appointment.appointment_date), 'PPP p')}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            statusColors[appointment.status]
          }`}
        >
          {appointment.status}
        </span>
      </div>

      {appointment.notes && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">{appointment.notes}</p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <select
          value={appointment.status}
          onChange={(e) =>
            onStatusChange(appointment.id, e.target.value as Appointment['status'])
          }
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => onFollowUp(appointment)}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
        >
          Schedule Follow-up
        </button>
      </div>
    </div>
  );
};