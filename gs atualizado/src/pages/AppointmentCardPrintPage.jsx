import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Printer, Scissors, CalendarDays, Clock, User, DollarSign, MapPin, Phone, Coins, CreditCard, Landmark } from 'lucide-react';

const paymentMethods = [
  { value: 'dinheiro', label: 'Dinheiro', icon: <Coins className="mr-2 h-4 w-4" /> },
  { value: 'pix', label: 'PIX', icon: <Landmark className="mr-2 h-4 w-4" /> },
  { value: 'credito', label: 'Cartão de Crédito', icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { value: 'debito', label: 'Cartão de Débito', icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { value: 'fiado', label: 'Fiado', icon: <DollarSign className="mr-2 h-4 w-4" /> },
];


const AppointmentCardPrintPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment, client } = location.state || {};
  const [studioName, setStudioName] = useState("GS Mega Hair Studio Agendamento");
  const [studioLogo, setStudioLogo] = useState(null);
  const [studioAddress, setStudioAddress] = useState("Rua Exemplo, 123, Bairro, Cidade");
  const [studioPhone, setStudioPhone] = useState("(XX) YYYYY-ZZZZ");

  useEffect(() => {
    const sName = localStorage.getItem('studioName');
    if (sName) setStudioName(sName);
    const sLogo = localStorage.getItem('studioLogo');
    if (sLogo) setStudioLogo(sLogo);
    
    if (!appointment || !client) {
      navigate('/appointments');
    } else {
      setTimeout(() => {
        window.print();
      }, 500); 
    }
  }, [appointment, client, navigate]);

  if (!appointment || !client) {
    return <p>Carregando dados para impressão...</p>;
  }

  const appointmentDate = parseISO(appointment.date);
  const formattedDate = isValid(appointmentDate) ? format(appointmentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Data inválida';
  const formattedTime = appointment.time || 'Horário não definido';

  const getPaymentMethodLabel = (value) => {
    const method = paymentMethods.find(pm => pm.value === value);
    return method ? method.label : (value || 'Não especificado');
  };

  const cardStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    width: '320px',
    margin: 'auto',
    padding: '20px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    color: '#333',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    borderBottom: '1px dashed #ccc',
    paddingBottom: '15px',
  };

  const logoStyle = {
    maxHeight: '60px',
    maxWidth: '150px',
    margin: '0 auto 10px auto',
    objectFit: 'contain',
  };

  const studioNameStyle = {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: 'var(--primary, #7c3aed)',
    margin: '5px 0',
  };

  const sectionTitleStyle = {
    fontSize: '1.1em',
    fontWeight: '600',
    color: 'var(--secondary, #e879f9)',
    marginTop: '15px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  };

  const detailItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '0.95em',
  };

  const iconStyle = {
    marginRight: '10px',
    color: 'var(--primary, #7c3aed)',
    flexShrink: 0,
  };

  const footerStyle = {
    marginTop: '25px',
    paddingTop: '15px',
    borderTop: '1px dashed #ccc',
    textAlign: 'center',
    fontSize: '0.85em',
    color: '#777',
  };
  
  const printButtonStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 15px',
    backgroundColor: 'var(--primary, #7c3aed)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  };


  return (
    <div className="print-area">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .no-print {
            display: none !important;
          }
          #root {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
        :root {
          --primary: ${localStorage.getItem('appColors') ? JSON.parse(localStorage.getItem('appColors')).primary : '#7c3aed'};
          --secondary: ${localStorage.getItem('appColors') ? JSON.parse(localStorage.getItem('appColors')).secondary : '#e879f9'};
        }
      `}</style>
      
      <button onClick={() => window.print()} style={printButtonStyle} className="no-print">
        <Printer size={18} style={{ marginRight: '8px' }} /> Imprimir Cartão
      </button>

      <div style={cardStyle}>
        <div style={headerStyle}>
          {studioLogo && <img src={studioLogo} alt="Logo" style={logoStyle} />}
          <div style={studioNameStyle}>{studioName}</div>
          <p style={{ fontSize: '0.9em', margin: '5px 0' }}>Comprovante de Agendamento</p>
        </div>

        <div>
          <div style={sectionTitleStyle}><User size={20} style={iconStyle} /> Cliente</div>
          <div style={detailItemStyle}>
            <span>{client.name}</span>
          </div>
          {client.phone && (
            <div style={detailItemStyle}>
              <Phone size={16} style={iconStyle} />
              <span>{client.phone}</span>
            </div>
          )}
        </div>

        <div>
          <div style={sectionTitleStyle}><Scissors size={20} style={iconStyle} /> Agendamento</div>
          <div style={detailItemStyle}>
            <CalendarDays size={16} style={iconStyle} />
            <span>{formattedDate}</span>
          </div>
          <div style={detailItemStyle}>
            <Clock size={16} style={iconStyle} />
            <span>{formattedTime}</span>
          </div>
          <div style={detailItemStyle}>
            <Scissors size={16} style={iconStyle} />
            <span>{appointment.service}</span>
          </div>
          {appointment.serviceValue && (
            <div style={detailItemStyle}>
              <DollarSign size={16} style={iconStyle} />
              <span>Valor: R$ {parseFloat(appointment.serviceValue).toFixed(2)}</span>
            </div>
          )}
           {appointment.paymentMethod && (
            <div style={detailItemStyle}>
                {paymentMethods.find(pm => pm.value === appointment.paymentMethod)?.icon || <DollarSign size={16} style={iconStyle} />}
              <span>Pagamento: {getPaymentMethodLabel(appointment.paymentMethod)}</span>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <p style={{ margin: '3px 0' }}>{studioAddress}</p>
          <p style={{ margin: '3px 0' }}>{studioPhone}</p>
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Obrigado pela preferência!</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCardPrintPage;