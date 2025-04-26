'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Form() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    dirty: false,
    submitted: false,
    errors: { name: '', email: '', subject: '', message: '' }
  });
  
  // ... rest of the code remains unchanged
} 