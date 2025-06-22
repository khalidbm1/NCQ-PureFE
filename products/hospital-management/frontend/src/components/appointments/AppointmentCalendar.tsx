import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventInput, EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import {
  Box,
  Paper,
  useTheme,
  Tooltip,
  Chip,
  Typography,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { Appointment, updateAppointment } from '../../store/slices/appointmentSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { format } from 'date-fns';

interface AppointmentCalendarProps {
  onSelectSlot: (start: Date, end: Date) => void;
  onSelectAppointment: (appointment: Appointment) => void;
  view: 'month' | 'week' | 'day';
  selectedDate: Date;
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  onDateChange: (date: Date) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onSelectSlot,
  onSelectAppointment,
  view,
  selectedDate,
  onViewChange,
  onDateChange,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const calendarRef = useRef<FullCalendar>(null);
  const { appointments } = useSelector((state: RootState) => state.appointments);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.palette.success.main;
      case 'scheduled': return theme.palette.info.main;
      case 'in_progress': return theme.palette.warning.main;
      case 'completed': return theme.palette.success.dark;
      case 'cancelled': return theme.palette.error.main;
      case 'no_show': return theme.palette.grey[500];
      default: return theme.palette.primary.main;
    }
  };

  const mapAppointmentsToEvents = (): EventInput[] => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.patient_name} - ${appointment.doctor_name}`,
      start: `${appointment.appointment_date}T${appointment.appointment_time}`,
      end: new Date(
        new Date(`${appointment.appointment_date}T${appointment.appointment_time}`).getTime() + 
        appointment.duration * 60000
      ).toISOString(),
      backgroundColor: getStatusColor(appointment.status),
      borderColor: getStatusColor(appointment.status),
      extendedProps: {
        appointment,
        status: appointment.status,
        department: appointment.department,
        type: appointment.type,
      },
    }));
  };

  const handleEventClick = (info: EventClickArg) => {
    const appointment = info.event.extendedProps.appointment;
    onSelectAppointment(appointment);
  };

  const handleDateSelect = (info: DateSelectArg) => {
    onSelectSlot(info.start, info.end);
  };

  const handleEventDrop = async (info: EventDropArg) => {
    const appointment = info.event.extendedProps.appointment;
    const newDate = format(info.event.start!, 'yyyy-MM-dd');
    const newTime = format(info.event.start!, 'HH:mm');

    try {
      await dispatch(updateAppointment({
        id: appointment.id,
        data: {
          appointment_date: newDate,
          appointment_time: newTime,
        }
      })).unwrap();

      dispatch(showNotification({
        message: 'Appointment rescheduled successfully',
        severity: 'success',
      }));
    } catch (error) {
      info.revert();
      dispatch(showNotification({
        message: 'Failed to reschedule appointment',
        severity: 'error',
      }));
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const appointment = eventInfo.event.extendedProps.appointment;
    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="body2">{appointment.patient_name}</Typography>
            <Typography variant="caption">{appointment.doctor_name}</Typography>
            <Typography variant="caption" display="block">
              {appointment.department}
            </Typography>
            <Typography variant="caption" display="block">
              {appointment.appointment_time} - {appointment.duration}min
            </Typography>
            <Chip
              label={appointment.status}
              size="small"
              sx={{
                mt: 0.5,
                backgroundColor: getStatusColor(appointment.status),
                color: 'white',
                fontSize: '0.7rem',
              }}
            />
          </Box>
        }
      >
        <Box sx={{ p: 0.5, overflow: 'hidden' }}>
          <Typography variant="caption" noWrap display="block">
            {appointment.patient_name}
          </Typography>
          <Typography variant="caption" noWrap display="block" sx={{ opacity: 0.8 }}>
            {appointment.doctor_name}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ height: 'calc(100vh - 250px)' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={view === 'month' ? 'dayGridMonth' : view === 'week' ? 'timeGridWeek' : 'timeGridDay'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          events={mapAppointmentsToEvents()}
          editable={true}
          selectable={true}
          selectMirror={true}
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          eventContent={renderEventContent}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          height="100%"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: '08:00',
            endTime: '18:00',
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          dayMaxEvents={true}
          weekends={true}
          nowIndicator={true}
          eventClassNames={(arg) => {
            return [`status-${arg.event.extendedProps.status}`];
          }}
          datesSet={(dateInfo) => {
            onDateChange(dateInfo.start);
            const view = dateInfo.view.type;
            if (view === 'dayGridMonth') onViewChange('month');
            else if (view === 'timeGridWeek') onViewChange('week');
            else if (view === 'timeGridDay') onViewChange('day');
          }}
        />
      </Box>
    </Paper>
  );
};

export default AppointmentCalendar;