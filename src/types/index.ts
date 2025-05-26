export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  follow_up_date: string | null;
  created_at: string;
}

export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  specialty: string;
  created_at: string;
}