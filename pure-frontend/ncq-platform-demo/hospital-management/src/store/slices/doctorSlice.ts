import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Doctor {
  id: string;
  doctor_id: string;
  first_name: string;
  last_name: string;
  title: string; // Dr., Prof., etc.
  specialization: string[];
  department: string;
  email: string;
  phone: string;
  emergency_phone?: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  license_number: string;
  license_expiry: string;
  education: Education[];
  experience: Experience[];
  consultation_fee: number;
  follow_up_fee: number;
  status: 'active' | 'inactive' | 'on_leave' | 'suspended';
  is_available: boolean;
  languages: string[];
  bio: string;
  profile_image?: string;
  rating: number;
  total_reviews: number;
  joined_date: string;
  last_login?: string;
  // Schedule & Availability
  working_hours: WorkingHours;
  time_slots: TimeSlot[];
  leave_periods: LeavePeriod[];
  // Statistics
  total_patients: number;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  revenue_this_month: number;
  average_consultation_time: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: number;
  specialization?: string;
}

export interface Experience {
  id: string;
  position: string;
  hospital: string;
  start_date: string;
  end_date?: string;
  description: string;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface DaySchedule {
  is_working: boolean;
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  max_patients: number;
  slot_duration: number; // in minutes
}

export interface LeavePeriod {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  type: 'vacation' | 'sick' | 'emergency' | 'conference' | 'other';
  status: 'pending' | 'approved' | 'rejected';
}

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  specializations: string[];
  departments: string[];
  currentView: 'list' | 'grid' | 'schedule';
  filters: {
    department: string;
    specialization: string;
    status: string;
    availability: string;
  };
}

// Mock data for development
const generateMockDoctors = (): Doctor[] => {
  const specializations = [
    ['General Medicine', 'Family Medicine'],
    ['Cardiology', 'Interventional Cardiology'],
    ['Pediatrics', 'Neonatal Care'],
    ['Orthopedics', 'Sports Medicine'],
    ['Dermatology', 'Cosmetic Dermatology'],
    ['Neurology', 'Stroke Medicine'],
    ['Psychiatry', 'Child Psychiatry'],
    ['Radiology', 'Interventional Radiology'],
    ['Emergency Medicine', 'Trauma Care'],
    ['Anesthesiology', 'Pain Management'],
    ['Dentistry', 'Oral Surgery', 'Orthodontics'],
  ];

  const departments = [
    'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology',
    'Neurology', 'Psychiatry', 'Radiology', 'Emergency', 'Anesthesiology', 'Dentistry'
  ];

  const doctors: Doctor[] = [
    {
      id: 'doc1',
      doctor_id: 'DOC001',
      title: 'Dr.',
      first_name: 'Sarah',
      last_name: 'Johnson',
      specialization: specializations[0],
      department: departments[0],
      email: 'sarah.johnson@hospital.com',
      phone: '(555) 123-4567',
      emergency_phone: '(555) 123-4568',
      date_of_birth: '1975-03-15',
      gender: 'Female',
      address: '123 Medical Drive',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      license_number: 'NY123456',
      license_expiry: '2025-12-31',
      education: [
        { id: 'edu1', degree: 'MD', institution: 'Harvard Medical School', year: 2000 },
        { id: 'edu2', degree: 'Residency', institution: 'Johns Hopkins Hospital', year: 2004 }
      ],
      experience: [
        {
          id: 'exp1',
          position: 'Senior Physician',
          hospital: 'General Hospital',
          start_date: '2010-01-01',
          description: 'Leading general medicine department'
        }
      ],
      consultation_fee: 150,
      follow_up_fee: 100,
      status: 'active',
      is_available: true,
      languages: ['English', 'Spanish'],
      bio: 'Dr. Sarah Johnson is a board-certified family medicine physician with over 20 years of experience.',
      rating: 4.8,
      total_reviews: 245,
      joined_date: '2010-01-01',
      last_login: '2024-01-15T09:30:00Z',
      working_hours: {
        monday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        tuesday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        wednesday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        thursday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        friday: { is_working: true, start_time: '09:00', end_time: '15:00' },
        saturday: { is_working: false, start_time: '', end_time: '' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot1', start_time: '09:00', end_time: '12:00', max_patients: 8, slot_duration: 30 },
        { id: 'slot2', start_time: '13:00', end_time: '17:00', max_patients: 8, slot_duration: 30 }
      ],
      leave_periods: [],
      total_patients: 1250,
      total_appointments: 3200,
      completed_appointments: 2890,
      cancelled_appointments: 180,
      revenue_this_month: 18500,
      average_consultation_time: 25
    },
    {
      id: 'doc2',
      doctor_id: 'DOC002',
      title: 'Dr.',
      first_name: 'Michael',
      last_name: 'Chen',
      specialization: specializations[1],
      department: departments[1],
      email: 'michael.chen@hospital.com',
      phone: '(555) 234-5678',
      date_of_birth: '1980-07-22',
      gender: 'Male',
      address: '456 Heart Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postal_code: '90001',
      license_number: 'CA789012',
      license_expiry: '2026-06-30',
      education: [
        { id: 'edu3', degree: 'MD', institution: 'Stanford Medical School', year: 2005 },
        { id: 'edu4', degree: 'Fellowship', institution: 'Mayo Clinic', year: 2009, specialization: 'Interventional Cardiology' }
      ],
      experience: [
        {
          id: 'exp2',
          position: 'Chief of Cardiology',
          hospital: 'Heart Center',
          start_date: '2015-06-01',
          description: 'Leading cardiac interventional procedures'
        }
      ],
      consultation_fee: 200,
      follow_up_fee: 150,
      status: 'active',
      is_available: true,
      languages: ['English', 'Mandarin'],
      bio: 'Dr. Michael Chen is a renowned cardiologist specializing in interventional procedures.',
      rating: 4.9,
      total_reviews: 189,
      joined_date: '2015-06-01',
      last_login: '2024-01-15T14:20:00Z',
      working_hours: {
        monday: { is_working: true, start_time: '08:00', end_time: '16:00', break_start: '12:00', break_end: '13:00' },
        tuesday: { is_working: true, start_time: '08:00', end_time: '16:00', break_start: '12:00', break_end: '13:00' },
        wednesday: { is_working: true, start_time: '08:00', end_time: '16:00', break_start: '12:00', break_end: '13:00' },
        thursday: { is_working: true, start_time: '08:00', end_time: '16:00', break_start: '12:00', break_end: '13:00' },
        friday: { is_working: true, start_time: '08:00', end_time: '14:00' },
        saturday: { is_working: true, start_time: '09:00', end_time: '13:00' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot3', start_time: '08:00', end_time: '12:00', max_patients: 6, slot_duration: 45 },
        { id: 'slot4', start_time: '13:00', end_time: '16:00', max_patients: 4, slot_duration: 45 }
      ],
      leave_periods: [
        {
          id: 'leave1',
          start_date: '2024-02-15',
          end_date: '2024-02-22',
          reason: 'Medical Conference',
          type: 'conference',
          status: 'approved'
        }
      ],
      total_patients: 890,
      total_appointments: 2100,
      completed_appointments: 1950,
      cancelled_appointments: 85,
      revenue_this_month: 24500,
      average_consultation_time: 35
    },
    // Add more doctors...
    {
      id: 'doc3',
      doctor_id: 'DOC003',
      title: 'Dr.',
      first_name: 'Emily',
      last_name: 'Williams',
      specialization: specializations[2],
      department: departments[2],
      email: 'emily.williams@hospital.com',
      phone: '(555) 345-6789',
      date_of_birth: '1982-11-08',
      gender: 'Female',
      address: '789 Kids Lane',
      city: 'Chicago',
      state: 'IL',
      postal_code: '60601',
      license_number: 'IL345678',
      license_expiry: '2025-09-30',
      education: [
        { id: 'edu5', degree: 'MD', institution: 'University of Chicago', year: 2007 },
        { id: 'edu6', degree: 'Residency', institution: 'Children\'s Hospital', year: 2011 }
      ],
      experience: [
        {
          id: 'exp3',
          position: 'Pediatric Specialist',
          hospital: 'Children\'s Medical Center',
          start_date: '2012-08-01',
          description: 'Specialized care for children and adolescents'
        }
      ],
      consultation_fee: 175,
      follow_up_fee: 125,
      status: 'active',
      is_available: false, // Currently on leave
      languages: ['English', 'French'],
      bio: 'Dr. Emily Williams is dedicated to providing comprehensive pediatric care with a gentle approach.',
      rating: 4.7,
      total_reviews: 156,
      joined_date: '2012-08-01',
      last_login: '2024-01-10T16:45:00Z',
      working_hours: {
        monday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:30', break_end: '13:30' },
        tuesday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:30', break_end: '13:30' },
        wednesday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:30', break_end: '13:30' },
        thursday: { is_working: true, start_time: '09:00', end_time: '17:00', break_start: '12:30', break_end: '13:30' },
        friday: { is_working: true, start_time: '09:00', end_time: '15:00' },
        saturday: { is_working: false, start_time: '', end_time: '' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot5', start_time: '09:00', end_time: '12:30', max_patients: 10, slot_duration: 20 },
        { id: 'slot6', start_time: '13:30', end_time: '17:00', max_patients: 10, slot_duration: 20 }
      ],
      leave_periods: [
        {
          id: 'leave2',
          start_date: '2024-01-20',
          end_date: '2024-01-25',
          reason: 'Family Emergency',
          type: 'emergency',
          status: 'approved'
        }
      ],
      total_patients: 675,
      total_appointments: 1850,
      completed_appointments: 1720,
      cancelled_appointments: 95,
      revenue_this_month: 16750,
      average_consultation_time: 18
    },
    // Add more doctors for better demo
    {
      id: 'doc4',
      doctor_id: 'DOC004',
      title: 'Dr.',
      first_name: 'Robert',
      last_name: 'Taylor',
      specialization: specializations[3],
      department: departments[3],
      email: 'robert.taylor@hospital.com',
      phone: '(555) 456-7890',
      date_of_birth: '1978-04-12',
      gender: 'Male',
      address: '321 Bone Street',
      city: 'Houston',
      state: 'TX',
      postal_code: '77001',
      license_number: 'TX567890',
      license_expiry: '2025-11-30',
      education: [
        { id: 'edu7', degree: 'MD', institution: 'Baylor College of Medicine', year: 2003 },
        { id: 'edu8', degree: 'Fellowship', institution: 'Cleveland Clinic', year: 2008, specialization: 'Sports Medicine' }
      ],
      experience: [
        {
          id: 'exp4',
          position: 'Head of Orthopedics',
          hospital: 'Sports Medicine Center',
          start_date: '2010-03-01',
          description: 'Specializing in sports injuries and joint replacements'
        }
      ],
      consultation_fee: 180,
      follow_up_fee: 120,
      status: 'active',
      is_available: true,
      languages: ['English'],
      bio: 'Dr. Robert Taylor is an expert in orthopedic surgery with a focus on sports medicine.',
      rating: 4.6,
      total_reviews: 134,
      joined_date: '2010-03-01',
      working_hours: {
        monday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '12:00' },
        tuesday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '12:00' },
        wednesday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '12:00' },
        thursday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '12:00' },
        friday: { is_working: true, start_time: '07:00', end_time: '13:00' },
        saturday: { is_working: false, start_time: '', end_time: '' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot7', start_time: '07:00', end_time: '11:00', max_patients: 8, slot_duration: 30 },
        { id: 'slot8', start_time: '12:00', end_time: '15:00', max_patients: 6, slot_duration: 30 }
      ],
      leave_periods: [],
      total_patients: 980,
      total_appointments: 2400,
      completed_appointments: 2280,
      cancelled_appointments: 60,
      revenue_this_month: 21600,
      average_consultation_time: 28
    },
    {
      id: 'doc5',
      doctor_id: 'DOC005',
      title: 'Dr.',
      first_name: 'Lisa',
      last_name: 'Anderson',
      specialization: specializations[4],
      department: departments[4],
      email: 'lisa.anderson@hospital.com',
      phone: '(555) 567-8901',
      date_of_birth: '1985-09-25',
      gender: 'Female',
      address: '654 Skin Avenue',
      city: 'Phoenix',
      state: 'AZ',
      postal_code: '85001',
      license_number: 'AZ234567',
      license_expiry: '2026-03-31',
      education: [
        { id: 'edu9', degree: 'MD', institution: 'University of Arizona', year: 2009 },
        { id: 'edu10', degree: 'Residency', institution: 'UCLA Medical Center', year: 2013 }
      ],
      experience: [
        {
          id: 'exp5',
          position: 'Senior Dermatologist',
          hospital: 'Skin Care Institute',
          start_date: '2014-01-01',
          description: 'Expertise in medical and cosmetic dermatology'
        }
      ],
      consultation_fee: 160,
      follow_up_fee: 110,
      status: 'active',
      is_available: true,
      languages: ['English', 'Spanish'],
      bio: 'Dr. Lisa Anderson specializes in both medical and cosmetic dermatology procedures.',
      rating: 4.9,
      total_reviews: 267,
      joined_date: '2014-01-01',
      working_hours: {
        monday: { is_working: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },
        tuesday: { is_working: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },
        wednesday: { is_working: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },
        thursday: { is_working: true, start_time: '09:00', end_time: '18:00', break_start: '13:00', break_end: '14:00' },
        friday: { is_working: true, start_time: '09:00', end_time: '16:00' },
        saturday: { is_working: true, start_time: '10:00', end_time: '14:00' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot9', start_time: '09:00', end_time: '13:00', max_patients: 12, slot_duration: 20 },
        { id: 'slot10', start_time: '14:00', end_time: '18:00', max_patients: 12, slot_duration: 20 }
      ],
      leave_periods: [],
      total_patients: 1450,
      total_appointments: 3600,
      completed_appointments: 3420,
      cancelled_appointments: 120,
      revenue_this_month: 19200,
      average_consultation_time: 20
    },
    {
      id: 'doc6',
      doctor_id: 'DOC006',
      title: 'Dr.',
      first_name: 'David',
      last_name: 'Martinez',
      specialization: specializations[5],
      department: departments[5],
      email: 'david.martinez@hospital.com',
      phone: '(555) 678-9012',
      date_of_birth: '1976-12-03',
      gender: 'Male',
      address: '987 Brain Boulevard',
      city: 'Boston',
      state: 'MA',
      postal_code: '02101',
      license_number: 'MA890123',
      license_expiry: '2025-07-31',
      education: [
        { id: 'edu11', degree: 'MD', institution: 'Harvard Medical School', year: 2001 },
        { id: 'edu12', degree: 'PhD', institution: 'MIT', year: 2005, specialization: 'Neuroscience' }
      ],
      experience: [
        {
          id: 'exp6',
          position: 'Chief of Neurology',
          hospital: 'Brain & Spine Institute',
          start_date: '2008-05-01',
          description: 'Leading research in neurodegenerative diseases'
        }
      ],
      consultation_fee: 250,
      follow_up_fee: 175,
      status: 'active',
      is_available: true,
      languages: ['English', 'Spanish', 'Portuguese'],
      bio: 'Dr. David Martinez is a leading neurologist specializing in stroke and neurodegenerative diseases.',
      rating: 4.8,
      total_reviews: 198,
      joined_date: '2008-05-01',
      working_hours: {
        monday: { is_working: true, start_time: '08:00', end_time: '16:00', break_start: '12:00', break_end: '13:00' },
        tuesday: { is_working: true, start_time: '08:00', end_time: '16:00', break_start: '12:00', break_end: '13:00' },
        wednesday: { is_working: false, start_time: '', end_time: '' }, // Research day
        thursday: { is_working: true, start_time: '08:00', end_time: '16:00', break_start: '12:00', break_end: '13:00' },
        friday: { is_working: true, start_time: '08:00', end_time: '14:00' },
        saturday: { is_working: false, start_time: '', end_time: '' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot11', start_time: '08:00', end_time: '12:00', max_patients: 6, slot_duration: 40 },
        { id: 'slot12', start_time: '13:00', end_time: '16:00', max_patients: 4, slot_duration: 45 }
      ],
      leave_periods: [],
      total_patients: 760,
      total_appointments: 1900,
      completed_appointments: 1805,
      cancelled_appointments: 45,
      revenue_this_month: 28750,
      average_consultation_time: 40
    },
    {
      id: 'doc7',
      doctor_id: 'DOC007',
      title: 'Dr.',
      first_name: 'Jennifer',
      last_name: 'White',
      specialization: specializations[6],
      department: departments[6],
      email: 'jennifer.white@hospital.com',
      phone: '(555) 789-0123',
      date_of_birth: '1983-06-17',
      gender: 'Female',
      address: '246 Mind Lane',
      city: 'Seattle',
      state: 'WA',
      postal_code: '98101',
      license_number: 'WA456789',
      license_expiry: '2026-01-31',
      education: [
        { id: 'edu13', degree: 'MD', institution: 'University of Washington', year: 2008 },
        { id: 'edu14', degree: 'Residency', institution: 'Stanford Hospital', year: 2012 }
      ],
      experience: [
        {
          id: 'exp7',
          position: 'Psychiatrist',
          hospital: 'Mental Health Center',
          start_date: '2013-02-01',
          description: 'Specializing in anxiety and mood disorders'
        }
      ],
      consultation_fee: 190,
      follow_up_fee: 140,
      status: 'inactive',
      is_available: false,
      languages: ['English', 'French'],
      bio: 'Dr. Jennifer White specializes in treating anxiety, depression, and other mood disorders.',
      rating: 4.7,
      total_reviews: 145,
      joined_date: '2013-02-01',
      working_hours: {
        monday: { is_working: true, start_time: '10:00', end_time: '18:00', break_start: '14:00', break_end: '15:00' },
        tuesday: { is_working: true, start_time: '10:00', end_time: '18:00', break_start: '14:00', break_end: '15:00' },
        wednesday: { is_working: true, start_time: '10:00', end_time: '18:00', break_start: '14:00', break_end: '15:00' },
        thursday: { is_working: true, start_time: '10:00', end_time: '18:00', break_start: '14:00', break_end: '15:00' },
        friday: { is_working: true, start_time: '10:00', end_time: '16:00' },
        saturday: { is_working: false, start_time: '', end_time: '' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot13', start_time: '10:00', end_time: '14:00', max_patients: 6, slot_duration: 50 },
        { id: 'slot14', start_time: '15:00', end_time: '18:00', max_patients: 4, slot_duration: 50 }
      ],
      leave_periods: [],
      total_patients: 520,
      total_appointments: 1600,
      completed_appointments: 1520,
      cancelled_appointments: 40,
      revenue_this_month: 0, // Currently inactive
      average_consultation_time: 45
    },
    {
      id: 'doc8',
      doctor_id: 'DOC008',
      title: 'Dr.',
      first_name: 'James',
      last_name: 'Thompson',
      specialization: specializations[7],
      department: departments[7],
      email: 'james.thompson@hospital.com',
      phone: '(555) 890-1234',
      date_of_birth: '1979-10-28',
      gender: 'Male',
      address: '135 X-Ray Road',
      city: 'Denver',
      state: 'CO',
      postal_code: '80201',
      license_number: 'CO123890',
      license_expiry: '2025-05-31',
      education: [
        { id: 'edu15', degree: 'MD', institution: 'University of Colorado', year: 2004 },
        { id: 'edu16', degree: 'Fellowship', institution: 'Johns Hopkins', year: 2009, specialization: 'Interventional Radiology' }
      ],
      experience: [
        {
          id: 'exp8',
          position: 'Interventional Radiologist',
          hospital: 'Imaging Center',
          start_date: '2010-07-01',
          description: 'Expert in minimally invasive procedures'
        }
      ],
      consultation_fee: 220,
      follow_up_fee: 160,
      status: 'active',
      is_available: true,
      languages: ['English', 'German'],
      bio: 'Dr. James Thompson is skilled in interventional radiology and diagnostic imaging.',
      rating: 4.5,
      total_reviews: 112,
      joined_date: '2010-07-01',
      working_hours: {
        monday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '11:30' },
        tuesday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '11:30' },
        wednesday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '11:30' },
        thursday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '11:30' },
        friday: { is_working: true, start_time: '07:00', end_time: '15:00', break_start: '11:00', break_end: '11:30' },
        saturday: { is_working: false, start_time: '', end_time: '' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot15', start_time: '07:00', end_time: '11:00', max_patients: 10, slot_duration: 30 },
        { id: 'slot16', start_time: '11:30', end_time: '15:00', max_patients: 8, slot_duration: 30 }
      ],
      leave_periods: [],
      total_patients: 890,
      total_appointments: 2800,
      completed_appointments: 2660,
      cancelled_appointments: 70,
      revenue_this_month: 26400,
      average_consultation_time: 25
    },
    {
      id: 'doc9',
      doctor_id: 'DOC009',
      title: 'Dr.',
      first_name: 'Maria',
      last_name: 'Garcia',
      specialization: specializations[8],
      department: departments[8],
      email: 'maria.garcia@hospital.com',
      phone: '(555) 901-2345',
      date_of_birth: '1981-01-14',
      gender: 'Female',
      address: '789 Emergency Way',
      city: 'Miami',
      state: 'FL',
      postal_code: '33101',
      license_number: 'FL567123',
      license_expiry: '2026-02-28',
      education: [
        { id: 'edu17', degree: 'MD', institution: 'University of Miami', year: 2006 },
        { id: 'edu18', degree: 'Residency', institution: 'Jackson Memorial Hospital', year: 2010 }
      ],
      experience: [
        {
          id: 'exp9',
          position: 'Emergency Medicine Physician',
          hospital: 'Emergency Care Center',
          start_date: '2011-03-01',
          description: 'Expert in trauma and critical care'
        }
      ],
      consultation_fee: 200,
      follow_up_fee: 150,
      status: 'on_leave',
      is_available: false,
      languages: ['English', 'Spanish', 'Portuguese'],
      bio: 'Dr. Maria Garcia is an experienced emergency medicine physician with expertise in trauma care.',
      rating: 4.8,
      total_reviews: 223,
      joined_date: '2011-03-01',
      working_hours: {
        monday: { is_working: true, start_time: '19:00', end_time: '07:00', break_start: '01:00', break_end: '02:00' },
        tuesday: { is_working: true, start_time: '19:00', end_time: '07:00', break_start: '01:00', break_end: '02:00' },
        wednesday: { is_working: true, start_time: '19:00', end_time: '07:00', break_start: '01:00', break_end: '02:00' },
        thursday: { is_working: false, start_time: '', end_time: '' },
        friday: { is_working: false, start_time: '', end_time: '' },
        saturday: { is_working: false, start_time: '', end_time: '' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot17', start_time: '19:00', end_time: '01:00', max_patients: 20, slot_duration: 15 },
        { id: 'slot18', start_time: '02:00', end_time: '07:00', max_patients: 15, slot_duration: 20 }
      ],
      leave_periods: [
        {
          id: 'leave3',
          start_date: '2024-01-15',
          end_date: '2024-01-30',
          reason: 'Maternity Leave',
          type: 'other',
          status: 'approved'
        }
      ],
      total_patients: 2100,
      total_appointments: 4500,
      completed_appointments: 4275,
      cancelled_appointments: 125,
      revenue_this_month: 0, // On leave
      average_consultation_time: 15
    },
    {
      id: 'doc10',
      doctor_id: 'DOC010',
      title: 'Dr.',
      first_name: 'Christopher',
      last_name: 'Brown',
      specialization: specializations[9],
      department: departments[9],
      email: 'christopher.brown@hospital.com',
      phone: '(555) 012-3456',
      date_of_birth: '1977-05-09',
      gender: 'Male',
      address: '456 Surgery Center',
      city: 'Atlanta',
      state: 'GA',
      postal_code: '30301',
      license_number: 'GA789456',
      license_expiry: '2025-10-31',
      education: [
        { id: 'edu19', degree: 'MD', institution: 'Emory University', year: 2002 },
        { id: 'edu20', degree: 'Fellowship', institution: 'Mass General', year: 2007, specialization: 'Pain Management' }
      ],
      experience: [
        {
          id: 'exp10',
          position: 'Chief Anesthesiologist',
          hospital: 'Surgery Center',
          start_date: '2008-09-01',
          description: 'Specializing in complex surgical procedures and pain management'
        }
      ],
      consultation_fee: 210,
      follow_up_fee: 155,
      status: 'active',
      is_available: true,
      languages: ['English'],
      bio: 'Dr. Christopher Brown is an expert anesthesiologist with a subspecialty in pain management.',
      rating: 4.6,
      total_reviews: 167,
      joined_date: '2008-09-01',
      working_hours: {
        monday: { is_working: true, start_time: '06:00', end_time: '14:00' },
        tuesday: { is_working: true, start_time: '06:00', end_time: '14:00' },
        wednesday: { is_working: true, start_time: '06:00', end_time: '14:00' },
        thursday: { is_working: true, start_time: '06:00', end_time: '14:00' },
        friday: { is_working: true, start_time: '06:00', end_time: '14:00' },
        saturday: { is_working: true, start_time: '08:00', end_time: '12:00' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot19', start_time: '06:00', end_time: '14:00', max_patients: 12, slot_duration: 45 }
      ],
      leave_periods: [],
      total_patients: 1340,
      total_appointments: 3200,
      completed_appointments: 3040,
      cancelled_appointments: 80,
      revenue_this_month: 25200,
      average_consultation_time: 35
    },
    {
      id: 'doc11',
      doctor_id: 'DOC011',
      title: 'Dr.',
      first_name: 'Rachel',
      last_name: 'Chen',
      specialization: specializations[10],
      department: departments[10],
      email: 'rachel.chen@hospital.com',
      phone: '(555) 111-2222',
      date_of_birth: '1979-08-22',
      gender: 'Female',
      address: '789 Dental Plaza',
      city: 'Los Angeles',
      state: 'CA',
      postal_code: '90001',
      license_number: 'CA111222',
      license_expiry: '2026-03-31',
      education: [
        { id: 'edu21', degree: 'DDS', institution: 'UCLA School of Dentistry', year: 2004 },
        { id: 'edu22', degree: 'Residency', institution: 'USC Dental Center', year: 2007, specialization: 'Oral Surgery' }
      ],
      experience: [
        {
          id: 'exp11',
          position: 'Chief Dentist',
          hospital: 'Dental Care Center',
          start_date: '2008-06-01',
          description: 'Specializing in oral surgery and cosmetic dentistry'
        }
      ],
      consultation_fee: 180,
      follow_up_fee: 120,
      status: 'active',
      is_available: true,
      languages: ['English', 'Mandarin'],
      bio: 'Dr. Rachel Chen is an experienced dentist specializing in oral surgery and cosmetic dentistry.',
      rating: 4.9,
      total_reviews: 312,
      joined_date: '2008-06-01',
      working_hours: {
        monday: { is_working: true, start_time: '08:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        tuesday: { is_working: true, start_time: '08:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        wednesday: { is_working: true, start_time: '08:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        thursday: { is_working: true, start_time: '08:00', end_time: '17:00', break_start: '12:00', break_end: '13:00' },
        friday: { is_working: true, start_time: '08:00', end_time: '15:00' },
        saturday: { is_working: true, start_time: '09:00', end_time: '13:00' },
        sunday: { is_working: false, start_time: '', end_time: '' }
      },
      time_slots: [
        { id: 'slot20', start_time: '08:00', end_time: '12:00', max_patients: 8, slot_duration: 30 },
        { id: 'slot21', start_time: '13:00', end_time: '17:00', max_patients: 8, slot_duration: 30 }
      ],
      leave_periods: [],
      total_patients: 1680,
      total_appointments: 3950,
      completed_appointments: 3752,
      cancelled_appointments: 98,
      revenue_this_month: 21600,
      average_consultation_time: 30
    }
  ];

  return doctors;
};

const mockDoctors = generateMockDoctors();
const allSpecializations = Array.from(new Set(mockDoctors.flatMap(d => d.specialization))).sort();
const allDepartments = Array.from(new Set(mockDoctors.map(d => d.department))).sort();

const initialState: DoctorState = {
  doctors: mockDoctors,
  selectedDoctor: null,
  loading: false,
  error: null,
  totalCount: mockDoctors.length,
  currentPage: 1,
  specializations: allSpecializations,
  departments: allDepartments,
  currentView: 'grid',
  filters: {
    department: 'all',
    specialization: 'all',
    status: 'all',
    availability: 'all',
  },
};

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (params: { 
    page?: number; 
    per_page?: number; 
    department?: string; 
    specialization?: string;
    status?: string;
    search?: string;
  } = {}) => {
    const response = await api.get('/v1/doctors', { params });
    return response.data;
  }
);

export const createDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (doctorData: Partial<Doctor>) => {
    const response = await api.post('/v1/doctors', doctorData);
    return response.data;
  }
);

export const updateDoctor = createAsyncThunk(
  'doctors/updateDoctor',
  async ({ id, data }: { id: string; data: Partial<Doctor> }) => {
    const response = await api.put(`/v1/doctors/${id}`, data);
    return response.data;
  }
);

export const updateDoctorSchedule = createAsyncThunk(
  'doctors/updateSchedule',
  async ({ id, schedule }: { id: string; schedule: WorkingHours }) => {
    const response = await api.put(`/v1/doctors/${id}/schedule`, schedule);
    return response.data;
  }
);

export const addDoctorLeave = createAsyncThunk(
  'doctors/addLeave',
  async ({ id, leave }: { id: string; leave: Omit<LeavePeriod, 'id'> }) => {
    const response = await api.post(`/v1/doctors/${id}/leave`, leave);
    return response.data;
  }
);

export const updateDoctorAvailability = createAsyncThunk(
  'doctors/updateAvailability',
  async ({ id, is_available }: { id: string; is_available: boolean }) => {
    const response = await api.patch(`/v1/doctors/${id}/availability`, { is_available });
    return response.data;
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      state.selectedDoctor = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<'list' | 'grid' | 'schedule'>) => {
      state.currentView = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<DoctorState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFilters: (state) => {
      state.filters = {
        department: 'all',
        specialization: 'all',
        status: 'all',
        availability: 'all',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.items || state.doctors;
        state.totalCount = action.payload.total || state.totalCount;
        state.currentPage = action.payload.page || state.currentPage;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      })
      // Create doctor
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.doctors.unshift(action.payload);
        state.totalCount += 1;
      })
      // Update doctor
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload;
        }
      })
      // Update schedule
      .addCase(updateDoctorSchedule.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index].working_hours = action.payload.working_hours;
        }
        if (state.selectedDoctor && state.selectedDoctor.id === action.payload.id) {
          state.selectedDoctor.working_hours = action.payload.working_hours;
        }
      })
      // Add leave
      .addCase(addDoctorLeave.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(d => d.id === action.payload.doctor_id);
        if (index !== -1) {
          state.doctors[index].leave_periods.push(action.payload);
        }
        if (state.selectedDoctor && state.selectedDoctor.id === action.payload.doctor_id) {
          state.selectedDoctor.leave_periods.push(action.payload);
        }
      })
      // Update availability
      .addCase(updateDoctorAvailability.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index].is_available = action.payload.is_available;
        }
        if (state.selectedDoctor && state.selectedDoctor.id === action.payload.id) {
          state.selectedDoctor.is_available = action.payload.is_available;
        }
      });
  },
});

export const { 
  setSelectedDoctor, 
  setCurrentView, 
  setFilters, 
  clearError, 
  clearFilters 
} = doctorSlice.actions;

export default doctorSlice.reducer;