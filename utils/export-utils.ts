import type { Client, Appointment } from "../types"

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return

  try {
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            if (value === null || value === undefined) return ""
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Liberar memória
  } catch (error) {
    console.error("Erro ao exportar para CSV:", error)
    alert("Erro ao exportar dados. Tente novamente.")
  }
}

export const exportToPDF = async (data: any[], title: string, config: any) => {
  if (!data || data.length === 0) {
    alert("Não há dados para exportar")
    return
  }

  try {
    // Simulação de exportação para PDF
    // Em um ambiente real, você usaria uma biblioteca como jsPDF
    const content = `
      ${config.businessName}
      ${title}
      
      ${data.map((item) => JSON.stringify(item, null, 2)).join("\n\n")}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "-")}.txt`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Liberar memória
  } catch (error) {
    console.error("Erro ao exportar para PDF:", error)
    alert("Erro ao exportar dados. Tente novamente.")
  }
}

export const generateWhatsAppMessage = (appointment: Appointment, config: any) => {
  if (!appointment || !appointment.client || !appointment.service) {
    alert("Dados do agendamento incompletos")
    return
  }

  try {
    const message = `Olá ${appointment.client.name}! 

Lembramos que você tem um agendamento marcado:

📅 Data: ${new Date(appointment.date).toLocaleDateString("pt-BR")}
🕐 Horário: ${appointment.time}
💇‍♀️ Serviço: ${appointment.service.name}

${config.businessName}
📍 ${config.businessAddress}
📞 ${config.businessPhone}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  } catch (error) {
    console.error("Erro ao gerar mensagem WhatsApp:", error)
    alert("Erro ao gerar mensagem. Tente novamente.")
  }
}

export const generateBirthdayMessage = (client: Client, config: any) => {
  if (!client || !client.name) {
    alert("Dados do cliente incompletos")
    return
  }

  try {
    const message = `🎉 Parabéns, ${client.name}! 

Desejamos um feliz aniversário! 🎂

Como presente especial, que tal agendar um horário conosco? 
Temos promoções especiais para aniversariantes! 💇‍♀️✨

${config.businessName}
📍 ${config.businessAddress}
📞 ${config.businessPhone}`

    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = client.phone?.replace(/\D/g, "")

    if (!phoneNumber) {
      alert("Cliente não possui telefone cadastrado!")
      return
    }

    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  } catch (error) {
    console.error("Erro ao gerar mensagem de aniversário:", error)
    alert("Erro ao gerar mensagem. Tente novamente.")
  }
}

export const generateAppointmentReminderMessage = (appointment: Appointment, config: any) => {
  if (!appointment || !appointment.client || !appointment.service) {
    alert("Dados do agendamento incompletos")
    return
  }

  try {
    const appointmentDate = new Date(appointment.date)
    const today = new Date()
    const diffTime = appointmentDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let timeMessage = ""
    if (diffDays === 0) {
      timeMessage = "hoje"
    } else if (diffDays === 1) {
      timeMessage = "amanhã"
    } else {
      timeMessage = `em ${diffDays} dias`
    }

    const message = `🔔 Lembrete de Agendamento

Olá ${appointment.client.name}!

Você tem um agendamento marcado para ${timeMessage}:

📅 Data: ${appointmentDate.toLocaleDateString("pt-BR")}
🕐 Horário: ${appointment.time}
💇‍♀️ Serviço: ${appointment.service.name}
💰 Valor: R$ ${appointment.service.price}

Aguardamos você! 😊

${config.businessName}
📍 ${config.businessAddress}
📞 ${config.businessPhone}`

    const phoneNumber = appointment.client.phone?.replace(/\D/g, "")
    if (!phoneNumber) {
      alert("Cliente não possui telefone cadastrado!")
      return
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  } catch (error) {
    console.error("Erro ao gerar lembrete:", error)
    alert("Erro ao gerar lembrete. Tente novamente.")
  }
}

export const printClientAppointment = (appointment: Appointment, config: any) => {
  if (!appointment || !appointment.client || !appointment.service) {
    alert("Dados do agendamento incompletos")
    return
  }

  try {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agendamento - ${appointment.client.name}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { height: 80px; margin-bottom: 10px; }
          .title { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .subtitle { font-size: 18px; color: #666; }
          .content { margin: 20px 0; }
          .info-row { margin: 10px 0; padding: 8px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; display: inline-block; width: 120px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${config.logoUrl}" alt="Logo" class="logo" onerror="this.src='/placeholder.svg'; this.onerror=null;">
          <div class="title">${config.businessName}</div>
          <div class="subtitle">Comprovante de Agendamento</div>
        </div>
        
        <div class="content">
          <div class="info-row">
            <span class="label">Cliente:</span>
            ${appointment.client.name}
          </div>
          <div class="info-row">
            <span class="label">Telefone:</span>
            ${appointment.client.phone || "Não informado"}
          </div>
          <div class="info-row">
            <span class="label">Serviço:</span>
            ${appointment.service.name}
          </div>
          <div class="info-row">
            <span class="label">Data:</span>
            ${new Date(appointment.date).toLocaleDateString("pt-BR")}
          </div>
          <div class="info-row">
            <span class="label">Horário:</span>
            ${appointment.time}
          </div>
          <div class="info-row">
            <span class="label">Duração:</span>
            ${appointment.service.duration} minutos
          </div>
          <div class="info-row">
            <span class="label">Valor:</span>
            R$ ${appointment.service.price}
          </div>
          ${
            appointment.notes
              ? `
          <div class="info-row">
            <span class="label">Observações:</span>
            ${appointment.notes}
          </div>
          `
              : ""
          }
        </div>
        
        <div class="footer">
          <p>${config.businessAddress}</p>
          <p>Telefone: ${config.businessPhone} | E-mail: ${config.businessEmail}</p>
          <p>Impresso em: ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir")
      return
    }

    printWindow.document.write(printContent)
    printWindow.document.close()

    // Esperar o carregamento das imagens antes de imprimir
    setTimeout(() => {
      printWindow.print()
    }, 500)
  } catch (error) {
    console.error("Erro ao imprimir agendamento:", error)
    alert("Erro ao imprimir. Tente novamente.")
  }
}

export const printDayAgenda = (appointments: Appointment[], date: string, config: any) => {
  if (!appointments || !date) {
    alert("Dados incompletos para gerar agenda")
    return
  }

  try {
    const dayAppointments = appointments.filter((apt) => apt.date === date)
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agenda do Dia - ${formattedDate}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { height: 60px; margin-bottom: 10px; }
          .title { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .subtitle { font-size: 18px; color: #666; }
          .appointment { 
            border: 1px solid #ddd; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px;
            page-break-inside: avoid;
          }
          .time { font-size: 18px; font-weight: bold; color: #333; }
          .client { font-size: 16px; font-weight: bold; margin: 5px 0; }
          .service { color: #666; margin: 5px 0; }
          .contact { font-size: 12px; color: #888; }
          .summary { 
            background: #f5f5f5; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 5px;
          }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${config.logoUrl}" alt="Logo" class="logo" onerror="this.src='/placeholder.svg'; this.onerror=null;">
          <div class="title">${config.businessName}</div>
          <div class="subtitle">Agenda do Dia - ${formattedDate}</div>
        </div>
        
        <div class="summary">
          <strong>Resumo do Dia:</strong><br>
          Total de agendamentos: ${dayAppointments.length}<br>
          Receita estimada: R$ ${dayAppointments.reduce((total, apt) => total + apt.service.price, 0)}
        </div>
        
        ${
          dayAppointments.length === 0
            ? '<p style="text-align: center; color: #666; font-size: 18px;">Nenhum agendamento para este dia</p>'
            : dayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(
                  (appointment) => `
              <div class="appointment">
                <div class="time">${appointment.time}</div>
                <div class="client">${appointment.client.name}</div>
                <div class="service">${appointment.service.name} (${appointment.service.duration}min) - R$ ${appointment.service.price}</div>
                <div class="contact">${appointment.client.phone || ""} ${appointment.client.email || ""}</div>
                ${appointment.notes ? `<div style="margin-top: 8px; font-style: italic;">Obs: ${appointment.notes}</div>` : ""}
              </div>
            `,
                )
                .join("")
        }
        
        <div class="footer">
          <p>${config.businessAddress}</p>
          <p>Telefone: ${config.businessPhone} | E-mail: ${config.businessEmail}</p>
          <p>Impresso em: ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir")
      return
    }

    printWindow.document.write(printContent)
    printWindow.document.close()

    // Esperar o carregamento das imagens antes de imprimir
    setTimeout(() => {
      printWindow.print()
    }, 500)
  } catch (error) {
    console.error("Erro ao imprimir agenda do dia:", error)
    alert("Erro ao imprimir. Tente novamente.")
  }
}

export const printWeekAgenda = (appointments: Appointment[], startDate: string, config: any) => {
  if (!appointments || !startDate) {
    alert("Dados incompletos para gerar agenda semanal")
    return
  }

  try {
    const start = new Date(startDate)
    const weekDays = []

    // Gerar os 7 dias da semana
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      weekDays.push(day.toISOString().split("T")[0])
    }

    const weekAppointments = appointments.filter((apt) => weekDays.includes(apt.date))

    const formatWeekRange = () => {
      const endDate = new Date(start)
      endDate.setDate(start.getDate() + 6)
      return `${start.toLocaleDateString("pt-BR")} a ${endDate.toLocaleDateString("pt-BR")}`
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agenda da Semana - ${formatWeekRange()}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { height: 60px; margin-bottom: 10px; }
          .title { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .subtitle { font-size: 18px; color: #666; }
          .day-section { 
            margin: 20px 0; 
            page-break-inside: avoid;
          }
          .day-header { 
            background: #f0f0f0; 
            padding: 10px; 
            font-weight: bold; 
            font-size: 16px;
            border-radius: 5px;
          }
          .appointment { 
            border-left: 3px solid #007bff;
            margin: 8px 0; 
            padding: 10px; 
            background: #f9f9f9;
          }
          .time { font-weight: bold; color: #333; }
          .client { font-weight: bold; margin: 3px 0; }
          .service { color: #666; font-size: 14px; }
          .summary { 
            background: #e8f4fd; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 5px;
            border-left: 4px solid #007bff;
          }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${config.logoUrl}" alt="Logo" class="logo" onerror="this.src='/placeholder.svg'; this.onerror=null;">
          <div class="title">${config.businessName}</div>
          <div class="subtitle">Agenda da Semana - ${formatWeekRange()}</div>
        </div>
        
        <div class="summary">
          <strong>Resumo da Semana:</strong><br>
          Total de agendamentos: ${weekAppointments.length}<br>
          Receita estimada: R$ ${weekAppointments.reduce((total, apt) => total + apt.service.price, 0)}
        </div>
        
        ${weekDays
          .map((date) => {
            const dayAppointments = weekAppointments.filter((apt) => apt.date === date)
            const dayName = new Date(date).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
            })

            return `
            <div class="day-section">
              <div class="day-header">${dayName} (${dayAppointments.length} agendamentos)</div>
              ${
                dayAppointments.length === 0
                  ? '<p style="padding: 10px; color: #666; font-style: italic;">Nenhum agendamento</p>'
                  : dayAppointments
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map(
                        (appointment) => `
                    <div class="appointment">
                      <div class="time">${appointment.time} - ${appointment.client.name}</div>
                      <div class="service">${appointment.service.name} (R$ ${appointment.service.price})</div>
                    </div>
                  `,
                      )
                      .join("")
              }
            </div>
          `
          })
          .join("")}
        
        <div class="footer">
          <p>${config.businessAddress}</p>
          <p>Telefone: ${config.businessPhone} | E-mail: ${config.businessEmail}</p>
          <p>Impresso em: ${new Date().toLocaleString("pt-BR")}</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir")
      return
    }

    printWindow.document.write(printContent)
    printWindow.document.close()

    // Esperar o carregamento das imagens antes de imprimir
    setTimeout(() => {
      printWindow.print()
    }, 500)
  } catch (error) {
    console.error("Erro ao imprimir agenda da semana:", error)
    alert("Erro ao imprimir. Tente novamente.")
  }
}

// Função para verificar aniversários (agora com formato DD/MM)
export const checkBirthdays = (clients: Client[]): Client[] => {
  if (!clients || clients.length === 0) return []

  try {
    const today = new Date()
    const currentDay = today.getDate().toString().padStart(2, "0")
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0")
    const currentDayMonth = `${currentDay}/${currentMonth}`

    return clients.filter((client) => {
      if (!client.birthDate) return false

      // Se já está no formato DD/MM
      if (client.birthDate.includes("/")) {
        return client.birthDate === currentDayMonth
      }

      // Se está no formato antigo (YYYY-MM-DD), converter
      if (client.birthDate.includes("-")) {
        try {
          const date = new Date(client.birthDate)
          if (isNaN(date.getTime())) return false

          const day = date.getDate().toString().padStart(2, "0")
          const month = (date.getMonth() + 1).toString().padStart(2, "0")
          return `${day}/${month}` === currentDayMonth
        } catch (error) {
          console.error("Erro ao converter data:", error)
          return false
        }
      }

      return false
    })
  } catch (error) {
    console.error("Erro ao verificar aniversários:", error)
    return []
  }
}

// Função para verificar aniversários próximos (nos próximos X dias)
export const checkUpcomingBirthdays = (clients: Client[], daysAhead = 7): Client[] => {
  if (!clients || clients.length === 0) return []

  try {
    const today = new Date()
    const upcomingDates: string[] = []

    // Gerar datas para os próximos X dias
    for (let i = 0; i <= daysAhead; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      upcomingDates.push(`${day}/${month}`)
    }

    return clients.filter((client) => {
      if (!client.birthDate) return false

      // Se já está no formato DD/MM
      if (client.birthDate.includes("/")) {
        return upcomingDates.includes(client.birthDate)
      }

      // Se está no formato antigo (YYYY-MM-DD), converter
      if (client.birthDate.includes("-")) {
        try {
          const date = new Date(client.birthDate)
          if (isNaN(date.getTime())) return false

          const day = date.getDate().toString().padStart(2, "0")
          const month = (date.getMonth() + 1).toString().padStart(2, "0")
          return upcomingDates.includes(`${day}/${month}`)
        } catch (error) {
          console.error("Erro ao converter data:", error)
          return false
        }
      }

      return false
    })
  } catch (error) {
    console.error("Erro ao verificar aniversários próximos:", error)
    return []
  }
}
