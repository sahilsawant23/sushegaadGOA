export const generateGoogleMapsLink = (placeName: string, coordinates?: { lat: number; lng: number }) => {
  if (coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ', Goa, India')}`;
};

export const generatePhoneLink = (phoneNumber: string) => {
  return `tel:${phoneNumber}`;
};

export const generateWhatsAppLink = (phoneNumber: string, message?: string) => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
  const defaultMessage = message || 'Hi, I would like to make a reservation.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;
};

export const generateEmailLink = (email: string, subject?: string, body?: string) => {
  let link = `mailto:${email}`;
  const params = [];
  
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    link += `?${params.join('&')}`;
  }
  
  return link;
};

export const generateWebsiteLink = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

// Contact information for different venues/services
export const contactInfo = {
  sushegaadGoa: {
    phone: '+91 9876543210',
    email: 'info@sushegaadgoa.com',
    website: 'www.sushegaadgoa.com',
    whatsapp: '+919876543210'
  },
  emergency: {
    police: '100',
    ambulance: '108',
    fire: '101',
    tourist_helpline: '+91 832 2438751'
  },
  transportation: {
    goaTourism: '+91 832 2438751',
    taxiService: '+91 9876543211',
    bikeRental: '+91 9876543212'
  }
};

// Generate reservation links for different venues
export const generateReservationLink = (venueType: string, venueName: string) => {
  const message = `Hi, I would like to make a reservation at ${venueName}. Please let me know the availability and booking process.`;
  
  switch (venueType) {
    case 'restaurant':
      return generateWhatsAppLink(contactInfo.sushegaadGoa.whatsapp, message);
    case 'hotel':
      return generateEmailLink(contactInfo.sushegaadGoa.email, `Reservation Inquiry - ${venueName}`, message);
    case 'nightclub':
      return generatePhoneLink(contactInfo.sushegaadGoa.phone);
    default:
      return generateWhatsAppLink(contactInfo.sushegaadGoa.whatsapp, message);
  }
};