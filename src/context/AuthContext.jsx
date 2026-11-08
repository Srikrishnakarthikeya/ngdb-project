import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_USERS = {
  STUDENT: {
    id: 'PART-001',
    name: 'Prasad',
    email: 'prasad45@gmail.com',
    role: 'STUDENT',
    category: 'Student',
    institution: 'National Institute of Technology, Tiruchirappalli',
    branch: 'Computer Applications (MCA)',
    year: '2nd Year',
    rollNo: '205123045',
    phone: '+91 9876543210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  ADMIN: {
    id: 'ADM-001',
    name: 'Admin',
    email: 'admin@gmail.com',
    role: 'ADMIN',
    designation: 'Professor & Head of Department',
    department: 'Department of Computer Applications',
    phone: '+91 431 2503731',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  COORDINATOR: {
    id: 'COORD-01',
    name: 'Coordinator',
    email: 'coordinator@example.com',
    role: 'COORDINATOR',
    designation: 'Associate Professor',
    department: 'Department of Computer Applications',
    assignedEvents: ['EVT-101', 'EVT-104'],
    phone: '+91 9486001122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [registeredStudents, setRegisteredStudents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nitt_ca_registered_students') || '[]'); }
    catch { return []; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nitt_ca_auth_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user?.role === 'STUDENT') {
          if (user.id === 'PART-001') return { ...user, name: 'Prasad', email: 'prasad45@gmail.com' };
          return user;
        }
        if (user?.role === 'ADMIN') return { ...user, name: 'Admin' };
        if (user?.role === 'COORDINATOR') {
          return { ...user, name: 'Coordinator', email: 'coordinator@example.com' };
        }
        return user;
      } catch (e) {
        return null;
      }
    }
    return null; // Public / landing page view by default
  });

  useEffect(() => {
    localStorage.setItem('nitt_ca_registered_students', JSON.stringify(registeredStudents));
  }, [registeredStudents]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nitt_ca_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nitt_ca_auth_user');
    }
  }, [currentUser]);

  const loginStudent = (idOrEmail, password) => {
    const identifier = idOrEmail.trim().toLowerCase();
    const demos = [
      { user: DEFAULT_USERS.STUDENT, password: 'demoPass123' },
      { user: { ...DEFAULT_USERS.STUDENT, id: 'PART-002', name: 'xyz', email: 'xyz@gmail.com', rollNo: '21IT089', institution: 'National Institute of Technology Karnataka, Surathkal', branch: 'Information Technology', year: '3rd Year' }, password: 'demoPass123' }
    ];
    const demo = demos.find(({ user }) => user.email.toLowerCase() === identifier || user.rollNo.toLowerCase() === identifier);
    const registered = registeredStudents.find(({ user }) => user.email.toLowerCase() === identifier || user.rollNo?.toLowerCase() === identifier);
    const studentUser = demo ? (demo.password === password ? demo.user : null) : registered?.password === password ? registered.user : null;
    if (!studentUser) return { success: false, error: 'Incorrect email/ID or password. Check your details or create a student account.' };
    setCurrentUser(studentUser);
    return { success: true, user: studentUser };
  };

  const registerStudent = (details) => {
    const email = details.email.trim().toLowerCase();
    const exists = registeredStudents.some(({ user }) => user.email.toLowerCase() === email)
      || ['prasad45@gmail.com', 'xyz@gmail.com'].includes(email);
    if (exists) return { success: false, error: 'An account already exists with this email or student ID. Please sign in.' };
    const user = { ...DEFAULT_USERS.STUDENT, id: `PART-${String(Date.now()).slice(-6)}`, name: details.name.trim(), email, rollNo: '', phone: details.phone.trim(), institution: details.institution.trim(), branch: '', year: '' };
    setRegisteredStudents((previous) => [...previous, { user, password: details.password }]);
    setCurrentUser(user);
    return { success: true, user };
  };

  const loginAdmin = (email, password, role = 'ADMIN') => {
    const demoCredentials = {
      ADMIN: { email: 'admin@gmail.com', password: 'adminPass123' },
      COORDINATOR: { email: 'coordinator@example.com', password: 'demoPass123' }
    };
    const credentials = demoCredentials[role];
    if (!credentials || email.trim().toLowerCase() !== credentials.email || password !== credentials.password) {
      return { success: false, error: 'Incorrect demo email or password.' };
    }

    const targetUser = role === 'COORDINATOR' ? DEFAULT_USERS.COORDINATOR : DEFAULT_USERS.ADMIN;
    const userToSet = {
      ...targetUser,
      name: role === 'COORDINATOR' ? 'Coordinator' : 'Admin',
      email: credentials.email,
      role
    };
    setCurrentUser(userToSet);
    return { success: true, user: userToSet };
  };

  const switchRole = (role) => {
    if (DEFAULT_USERS[role]) {
      setCurrentUser(DEFAULT_USERS[role]);
    } else if (role === 'GUEST') {
      setCurrentUser(null);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = !!currentUser;
  const isStudent = currentUser?.role === 'STUDENT';
  const isAdmin = currentUser?.role === 'ADMIN';
  const isCoordinator = currentUser?.role === 'COORDINATOR';
  const isStaffOrAdmin = isAdmin || isCoordinator;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isStudent,
        isAdmin,
        isCoordinator,
        isStaffOrAdmin,
        loginStudent,
        registerStudent,
        loginAdmin,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
