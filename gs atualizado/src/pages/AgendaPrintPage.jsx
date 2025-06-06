import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, isValid, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const AgendaPrintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentsToPrint, periodType, referenceDate, clients, servicesList, appointmentTypes } = location.state || {};
  const [studioName, setStudioName] = useState("GS Mega Hair Studio Agendamento");
  const [logoSrc, setLogoSrc] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem('studioName');
    if (savedName) setStudioName(savedName);
    const savedLogo = localStorage.getItem('studioLogo');
    if (savedLogo) setLogoSrc(savedLogo);

    if (!appointmentsToPrint || !periodType || !referenceDate) {
      navigate('/appointments');
    } else {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [appointmentsToPrint, periodType, referenceDate, navigate]);

  if (!appointmentsToPrint || !periodType || !referenceDate) {
    return <p>Carregando dados para impressão...</p>;
  }

  let title = `Agenda`;
  let dateRange = '';

  const refDate = parseISO(referenceDate);

  if (periodType === 'day') {
    title = `Agenda do Dia`;
    dateRange = format(refDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  } else if (periodType === 'week') {
    title = `Agenda da Semana`;
    const weekStart = startOfWeek(refDate, { locale: ptBR });
    const weekEnd = endOfWeek(refDate, { locale: ptBR });
    dateRange = `${format(weekStart, "dd/MM/yy", { locale: ptBR })} - ${format(weekEnd, "dd/MM/yy", { locale: ptBR })}`;
  } else if (periodType === 'month') {
    title = `Agenda do Mês`;
    dateRange = format(refDate, "MMMM 'de' yyyy", { locale: ptBR });
  }
  
  const getClientName = (clientId) => clients?.find(c => c.id === clientId)?.name || 'Cliente não encontrado';
  const getAppointmentTypeName = (typeId) => appointmentTypes?.find(at => at.id === typeId)?.name || 'Padrão';

  return (
    <div className="p-4 sm:p-8 print-container bg-white text-black">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-size: 10pt;
          }
          .no-print {
            display: none;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
          h1, h2, h3 {
            color: #333;
          }
        }
      `}</style>
      <div className="flex justify-between items-center mb-6">
        <div>
          {logoSrc && <img src={logoSrc} alt="Logo" className="h-16 w-auto mb-2" />}
          <h1 className="text-2xl font-bold">{studioName}</h1>
        </div>
        <Button onClick={() => window.print()} className="no-print ml-auto">
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
      </div>
      
      <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>
      <h3 className="text-lg text-center mb-6">{dateRange}</h3>

      {appointmentsToPrint.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Horário</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Tipo</th>
              <th>Valor (R$)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointmentsToPrint.map((appt) => {
              const apptDate = parseISO(appt.date);
              return (
                <tr key={appt.id}>
                  <td>{isValid(apptDate) ? format(apptDate, 'dd/MM/yy', { locale: ptBR }) : 'Data inválida'}</td>
                  <td>{appt.time}</td>
                  <td>{getClientName(appt.clientId)}</td>
                  <td>{appt.service}</td>
                  <td>{getAppointmentTypeName(appt.appointmentType)}</td>
                  <td>{parseFloat(appt.serviceValue || 0).toFixed(2)}</td>
                  <td>{appt.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">Nenhum agendamento para este período.</p>
      )}
      <p className="text-xs text-gray-500 mt-8 text-center">Gerado em: {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
    </div>
  );
};

export default AgendaPrintPage;