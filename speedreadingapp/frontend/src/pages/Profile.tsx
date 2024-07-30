// src/pages/Profile.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { updateEmail, updatePassword } from 'firebase/auth';
