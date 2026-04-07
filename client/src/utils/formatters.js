// Format currency as VND
export const formatCurrency = (n) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

// Calculate discount percentage
export const calculateDiscount = (original, current) => 
  original && original > current ? Math.round((1 - current / original) * 100) : null;

// Format star rating
export const formatRating = (rating) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

// Format date
export const formatDate = (date) => 
  new Date(date).toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

// Truncate text
export const truncate = (str, len) => 
  str?.length > len ? str.slice(0, len) + '...' : str;

// Validate email
export const isValidEmail = (email) => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate Vietnamese phone number
export const isValidVietnamesePhone = (phone) => 
  /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone.replace(/\s/g, ''));

// Generate placeholder image
export const getPlaceholderImage = (category = 'tech') => 
  `https://images.unsplash.com/photo-1560393464-5c69a71c57a3?w=400&q=80`;
