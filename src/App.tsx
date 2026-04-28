import { useState, useEffect } from 'react';
import { 
  Clock, MapPin, User, LogOut, Home, 
  Briefcase, CheckCircle, Menu, X, FileText, 
  ChevronRight, Lock, AlertCircle,
  Users, Settings, Database, Plus, Edit, Trash2, Search, Save,
  ChevronDown, Filter, Calendar, Tag, CalendarDays, Check,
  Image as ImageIcon, Palmtree, History, Sun, Moon,
  WalletCards, Receipt, Mail 
} from 'lucide-react';

export default function App() {
  // --- State: Auth & User ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [loginForm, setLoginForm] = useState<any>({ id: '', pin: '' });
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- State: Location & Time ---
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userLocation, setUserLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [distanceToStore, setDistanceToStore] = useState<number | null>(null);

  // --- State: Navigation & Attendance ---
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [attendanceState, setAttendanceState] = useState<string>('out'); 
  const [todayLog, setTodayLog] = useState<any>({ in: null, out: null, shift: '', status: '' });
  const [selectedShift, setSelectedShift] = useState<string>(''); 

  const MAX_RADIUS = 100;

  // --- Admin Data States ---
  const [roles, setRoles] = useState<string[]>(['Kasir', 'Pramuniaga', 'SPV', 'Manager', 'Staff Admin']);
  const [newRole, setNewRole] = useState<string>('');

  const [employees, setEmployees] = useState<any[]>([
    { id: 'EMP-001', name: 'Budi Santoso', email: 'budi.contoh@gmail.com', role: 'Kasir', store: 'Cabang Sudirman', pin: '1234' },
    { id: 'EMP-002', name: 'Siti Aminah', email: 'siti.aminah@gmail.com', role: 'Pramuniaga', store: 'Cabang Thamrin', pin: '5678' },
    { id: 'EMP-003', name: 'Agus Pratama', email: 'agus.p@gmail.com', role: 'SPV', store: 'Cabang Sudirman', pin: '1234' },
  ]);
  
  const [stores, setStores] = useState<any[]>([
    { id: 'STR-01', name: 'Cabang Sudirman', lat: '-6.1753924', lng: '106.8271528', radius: 100 },
    { id: 'STR-02', name: 'Cabang Thamrin', lat: '-6.1834000', lng: '106.8200000', radius: 150 },
  ]);
  
  const [reports, setReports] = useState<any[]>([
    { id: 1, date: '2026-04-28', empId: 'EMP-001', name: 'Budi Santoso', store: 'Cabang Sudirman', in: '07:55', out: '15:35', status: 'Tepat Waktu' },
    { id: 2, date: '2026-04-28', empId: 'EMP-002', name: 'Siti Aminah', store: 'Cabang Thamrin', in: '14:20', out: '21:30', status: 'Terlambat' },
    { id: 3, date: '2026-04-29', empId: 'EMP-001', name: 'Budi Santoso', store: 'Cabang Sudirman', in: '08:00', out: '16:00', status: 'Tepat Waktu' },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<any[]>([
    { id: 'LV-001', empId: 'EMP-002', name: 'Siti Aminah', type: 'Sakit', startDate: '2026-04-20', endDate: '2026-04-23', reason: 'Tipus (Rawat Inap)', status: 'Disetujui', attachment: null },
    { id: 'LV-002', empId: 'EMP-001', name: 'Budi Santoso', type: 'Lembur', startDate: '2026-04-28', endDate: '2026-04-28', reason: 'Stok Opname Akhir Bulan', status: 'Disetujui', attachment: null }
  ]);
  const [leaveForm, setLeaveForm] = useState<any>({ type: 'Sakit', startDate: '', endDate: '', reason: '', attachment: null });
  const [viewAttachmentUrl, setViewAttachmentUrl] = useState<any>(null); 

  const [holidays, setHolidays] = useState<any[]>([
    { id: 'HOL-001', date: '2026-05-01', name: 'Hari Buruh Internasional' }
  ]);
  const [showHolidayModal, setShowHolidayModal] = useState<boolean>(false);
  const [holidayForm, setHolidayForm] = useState<any>({ id: '', date: '', name: '' });
  const [isEditingHoliday, setIsEditingHoliday] = useState<boolean>(false);

  const [payrollConfig, setPayrollConfig] = useState<any>({
    empId: '',
    gajiPokok: 3000000,
    tunjangan: 500000,
    manualAlfa: 0 
  });
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reportFilterDate, setReportFilterDate] = useState<string>('2026-04-28');
  const [reportFilterStore, setReportFilterStore] = useState<string>('Semua Toko');
  
  const [showEmpModal, setShowEmpModal] = useState<boolean>(false);
  const [empForm, setEmpForm] = useState<any>({ id: '', name: '', email: '', role: '', store: '', pin: '' });
  const [isEditingEmp, setIsEditingEmp] = useState<boolean>(false);

  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);
  const [storeForm, setStoreForm] = useState<any>({ id: '', name: '', lat: '', lng: '', radius: 100 });
  const [isEditingStore, setIsEditingStore] = useState<boolean>(false);

  const [dialog, setDialog] = useState<any>({ isOpen: false, type: 'alert', title: '', message: '', onConfirm: null });

  // --- Helper Functions ---
  const showAlert = (title: string, message: string) => setDialog({ isOpen: true, type: 'alert', title, message, onConfirm: null });
  const showConfirm = (title: string, message: string, onConfirmCallback: any) => setDialog({ isOpen: true, type: 'confirm', title, message, onConfirm: onConfirmCallback });
  const closeDialog = () => setDialog({ ...dialog, isOpen: false });

  const formatRupiah = (number: any) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(number) || 0);
  };

  const getDaysDiff = (start: any, end: any) => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  };

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user && user?.role !== 'admin') {
      getLocation();
    }
  }, [isLoggedIn, user]);

  const getLocation = () => {
    try {
      if (!navigator.geolocation) {
        setLocationError('Browser tidak mendukung akses lokasi.');
        return;
      }
      navigator.geolocation.watchPosition(
        (position) => {
          const currentLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(currentLoc);
          if (user && user?.storeLat && user?.storeLng) {
            const dist = calculateDistance(currentLoc.lat, currentLoc.lng, user.storeLat, user.storeLng);
            setDistanceToStore(Math.round(dist));
          }
        },
        () => setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif dan diizinkan.'),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    } catch (err) {
      setLocationError('Akses lokasi diblokir oleh sistem atau browser.');
    }
  };

  const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371e3; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  // --- API Handlers ---
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      setTimeout(() => {
        if (loginForm.id === 'ADMIN-001' && loginForm.pin === '8888') {
          setUser({ id: 'ADMIN-001', name: 'Super Admin', role: 'admin', storeName: 'Kantor Pusat' });
          setIsLoggedIn(true);
          setActiveTab('admin-dashboard'); 
        } else {
          const foundEmp = employees.find(emp => emp.id === loginForm.id.toUpperCase());
          // Cek kecocokan PIN dengan data di database (employees)
          if (foundEmp && loginForm.pin === foundEmp.pin) {
            const storeData = stores.find(s => s.name === foundEmp.store);
            setUser({ 
              id: foundEmp.id, 
              name: foundEmp.name, 
              role: 'employee', 
              jobRole: foundEmp.role,
              storeName: foundEmp.store, 
              storeLat: storeData ? parseFloat(storeData.lat) : -6.1753924, 
              storeLng: storeData ? parseFloat(storeData.lng) : 106.8271528 
            });
            setIsLoggedIn(true);
            setActiveTab('dashboard');
          } else {
            setLoginError('ID Karyawan atau PIN yang Anda masukkan salah.');
          }
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setLoginError('Gagal terhubung ke server.');
      setIsLoading(false);
    }
  };

  const handleSetLibur = () => {
    showConfirm("Konfirmasi Libur", "Anda mengkonfirmasi bahwa jadwal Anda hari ini adalah Libur / Off?", () => {
      const y = currentTime.getFullYear();
      const m = String(currentTime.getMonth() + 1).padStart(2, '0');
      const d = String(currentTime.getDate()).padStart(2, '0');
      const todayDateString = `${y}-${m}-${d}`;

      const newReport = {
        id: Date.now(),
        date: todayDateString,
        empId: user?.id,
        name: user?.name,
        store: user?.storeName,
        in: '-',
        out: '-',
        status: 'Libur Shift'
      };

      setReports([newReport, ...reports]);
      setTodayLog({ in: '-', out: '-', shift: 'Libur', status: 'Libur Shift' });
      setAttendanceState('done');
      showAlert("Berhasil", "Status jadwal Libur Anda untuk hari ini telah dicatat.");
    });
  };

  const handleClockAction = async (type: string) => {
    if (!selectedShift) {
      showAlert("Pilih Shift", "Silakan pilih shift Anda hari ini terlebih dahulu.");
      return;
    }

    if (distanceToStore !== null && distanceToStore > MAX_RADIUS) {
      showAlert("Di Luar Jangkauan", `Anda berada di luar jangkauan toko! (${distanceToStore} meter). Maksimal ${MAX_RADIUS} meter.`);
      return;
    }
    
    if (!userLocation) {
      showAlert("Menunggu GPS", "Menunggu lokasi GPS Anda...");
      return;
    }

    const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    if (type === 'in') {
      let currentStatus = 'Tepat Waktu';

      if (selectedShift === 'Pagi') {
        if (timeString < '07:45') {
          showAlert("Belum Waktunya", "Absen untuk Shift Pagi baru bisa dilakukan mulai pukul 07:45.");
          return;
        }
        if (timeString > '08:05') currentStatus = 'Terlambat';
      } else if (selectedShift === 'Siang') {
        if (timeString < '13:45') {
          showAlert("Belum Waktunya", "Absen untuk Shift Siang baru bisa dilakukan mulai pukul 13:45.");
          return;
        }
        if (timeString > '14:05') currentStatus = 'Terlambat';
      }

      setTodayLog({ ...todayLog, in: timeString, shift: selectedShift, status: currentStatus });
      setAttendanceState('in');
      
    } else { 
      setTodayLog({ ...todayLog, out: timeString });
      setAttendanceState('done');

      const y = currentTime.getFullYear();
      const m = String(currentTime.getMonth() + 1).padStart(2, '0');
      const d = String(currentTime.getDate()).padStart(2, '0');
      const todayDateString = `${y}-${m}-${d}`;
      
      let finalStatus = todayLog.status;
      const isNationalHoliday = holidays.find(h => h.date === todayDateString);
      
      if (isNationalHoliday) {
        finalStatus += ' (Lembur Libur)';
      }

      const newReport = {
        id: Date.now(),
        date: todayDateString,
        empId: user?.id,
        name: user?.name,
        store: user?.storeName,
        in: todayLog.in,
        out: timeString,
        status: finalStatus
      };

      setReports([newReport, ...reports]);
      showAlert('Absensi Selesai', 'Terima kasih, jam pulang Anda telah berhasil dicatat.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setTodayLog({ in: null, out: null, shift: '', status: '' });
    setSelectedShift('');
    setAttendanceState('out');
    setActiveTab('dashboard'); 
  };

  // --- Leave / Cuti / Lembur Functions ---
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showAlert('Format Salah', 'Mohon upload file berupa gambar (JPG/PNG).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLeaveForm({ ...leaveForm, attachment: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLeaveSubmit = (e: any) => {
    e.preventDefault();
    const newRequest = {
      id: `REQ-${Math.floor(Math.random() * 900) + 100}`,
      empId: user?.id,
      name: user?.name,
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.type === 'Lembur' ? leaveForm.startDate : leaveForm.endDate,
      reason: leaveForm.reason,
      attachment: leaveForm.type === 'Sakit' ? leaveForm.attachment : null, 
      status: 'Pending'
    };
    setLeaveRequests([newRequest, ...leaveRequests]);
    setLeaveForm({ type: 'Sakit', startDate: '', endDate: '', reason: '', attachment: null });
    showAlert('Berhasil Terkirim', 'Pengajuan Anda telah dikirim dan menunggu persetujuan Admin.');
  };

  const handleUpdateLeaveStatus = (id: any, newStatus: string) => {
    showConfirm('Konfirmasi Status', `Anda yakin ingin ${newStatus === 'Disetujui' ? 'Menyetujui' : 'Menolak'} pengajuan ini?`, () => {
      setLeaveRequests(leaveRequests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    });
  };

  // --- Admin Functions ---
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredReports = reports.filter(rep => {
    const matchDate = reportFilterDate ? rep.date === reportFilterDate : true;
    const matchStore = reportFilterStore === 'Semua Toko' ? true : rep.store === reportFilterStore;
    return matchDate && matchStore;
  });

  const handleAddRole = (e: any) => {
    e.preventDefault();
    if (newRole.trim() !== '' && !roles.includes(newRole.trim())) { 
      setRoles([...roles, newRole.trim()]); 
      setNewRole(''); 
    }
  };
  
  const handleDeleteRole = (roleToDelete: string) => { 
    showConfirm('Hapus Jabatan', `Yakin ingin menghapus jabatan: ${roleToDelete}?`, () => setRoles(roles.filter(role => role !== roleToDelete))); 
  };
  
  const openEmpModal = (emp: any = null) => {
    if (emp) { 
      setEmpForm(emp); 
      setIsEditingEmp(true); 
    } else { 
      setEmpForm({ id: '', name: '', email: '', role: '', store: stores[0]?.name || '', pin: '' }); 
      setIsEditingEmp(false); 
    }
    setShowEmpModal(true);
  };
  
  const saveEmp = (e: any) => {
    e.preventDefault();
    if (isEditingEmp) { 
      setEmployees(employees.map(emp => emp.id === empForm.id ? empForm : emp)); 
    } else { 
      setEmployees([...employees, empForm]); 
    }
    setShowEmpModal(false);
    showAlert('Berhasil Disimpan', `Data karyawan ${empForm.name} telah berhasil ${isEditingEmp ? 'diperbarui' : 'ditambahkan'}.`);
  };
  
  const deleteEmp = (id: string) => { 
    showConfirm('Hapus Karyawan', 'Yakin ingin menghapus karyawan ini secara permanen?', () => setEmployees(employees.filter(emp => emp.id !== id))); 
  };
  
  const openStoreModal = (store: any = null) => {
    if (store) { 
      setStoreForm(store); 
      setIsEditingStore(true); 
    } else { 
      setStoreForm({ id: `STR-${Math.floor(Math.random() * 90) + 10}`, name: '', lat: '', lng: '', radius: 100 }); 
      setIsEditingStore(false); 
    }
    setShowStoreModal(true);
  };
  
  const saveStore = (e: any) => {
    e.preventDefault();
    if (isEditingStore) { 
      setStores(stores.map(st => st.id === storeForm.id ? storeForm : st)); 
    } else { 
      setStores([...stores, storeForm]); 
    }
    setShowStoreModal(false);
  };
  
  const deleteStore = (id: string) => { 
    showConfirm('Hapus Cabang Toko', 'Yakin ingin menghapus cabang toko beserta pengaturan GPS-nya?', () => setStores(stores.filter(st => st.id !== id))); 
  };
  
  const openHolidayModal = (hol: any = null) => {
    if (hol) { 
      setHolidayForm(hol); 
      setIsEditingHoliday(true); 
    } else { 
      setHolidayForm({ id: `HOL-${Math.floor(Math.random() * 900) + 100}`, date: '', name: '' }); 
      setIsEditingHoliday(false); 
    }
    setShowHolidayModal(true);
  };
  
  const saveHoliday = (e: any) => {
    e.preventDefault();
    if (isEditingHoliday) { 
      setHolidays(holidays.map(h => h.id === holidayForm.id ? holidayForm : h)); 
    } else { 
      setHolidays([...holidays, holidayForm]); 
    }
    setShowHolidayModal(false);
  };
  
  const deleteHoliday = (id: string) => { 
    showConfirm('Hapus Hari Libur', 'Yakin ingin menghapus hari libur ini?', () => setHolidays(holidays.filter(h => h.id !== id))); 
  };
  
  const exportReport = () => { 
    showAlert('Berhasil Export', `✅ Laporan berhasil diekspor ke Excel!`); 
  };

  const handleSendPayslipEmail = (email: string) => {
    if (!email) {
      showAlert('Gagal Mengirim', 'Karyawan ini belum memiliki alamat email yang terdaftar. Silakan edit data karyawan terlebih dahulu.');
      return;
    }
    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      showAlert('Email Terkirim', `Slip gaji berhasil dikirimkan ke alamat email: ${email}`);
    }, 1500);
  };

  // --- Common UI Classes ---
  const inputModernClass = "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white outline-none shadow-sm hover:border-gray-300 transition-all duration-200 text-gray-700";
  const selectModernClass = "appearance-none w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white outline-none shadow-sm hover:border-gray-300 transition-all duration-200 text-gray-700 cursor-pointer";

  // ==========================================
  // VIEW: ADMIN PAYROLL / PENGGAJIAN
  // ==========================================
  const renderAdminPayroll = () => {
    const selectedEmp = employees.find(e => e.id === payrollConfig.empId);
    const stats = { hadir: 0, lembur: 0, sakit: 0, izin: 0, alfa: Number(payrollConfig.manualAlfa) || 0 };

    if (selectedEmp) {
      const empReports = reports.filter(r => r.empId === selectedEmp.id && r.status !== 'Libur Shift');
      stats.hadir = empReports.length;

      const empLeaves = leaveRequests.filter(r => r.empId === selectedEmp.id && r.status === 'Disetujui');
      empLeaves.forEach(req => {
        const days = getDaysDiff(req.startDate, req.endDate);
        if (req.type === 'Sakit') stats.sakit += days;
        if (req.type === 'Izin') stats.izin += days;
        if (req.type === 'Lembur') stats.lembur += days; 
      });
    }

    const dailyRate = Math.round(Number(payrollConfig.gajiPokok) / 26);
    const potongSakitHari = Math.max(0, stats.sakit - 3);
    const nominalPotongSakit = potongSakitHari * dailyRate;
    const nominalPotongIzin = stats.izin * dailyRate;
    const nominalPotongAlfa = stats.alfa * dailyRate;

    const nominalLembur = stats.lembur * dailyRate;
    const pendapatan = Number(payrollConfig.gajiPokok) + Number(payrollConfig.tunjangan) + nominalLembur;
    const potongan = nominalPotongSakit + nominalPotongIzin + nominalPotongAlfa;
    const totalGajiBersih = pendapatan - potongan;

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Hitung Gaji (Payroll)</h2>
            <p className="text-sm text-gray-500 mt-1">Kalkulasi otomatis gaji karyawan berdasarkan data absensi.</p>
          </div>
          {selectedEmp && (
            <div className="flex space-x-2 w-full md:w-auto">
              <button onClick={() => showAlert('Cetak Slip', 'Dokumen slip gaji PDF sedang disiapkan untuk diunduh...')} className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium transition-all">
                <Receipt size={18} /> <span className="hidden sm:inline">Cetak PDF</span>
              </button>
              <button 
                onClick={() => handleSendPayslipEmail(selectedEmp.email)} 
                disabled={isSendingEmail}
                className="flex flex-1 md:flex-none items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-500/30 disabled:bg-blue-400"
              >
                {isSendingEmail ? (
                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                   <Mail size={18} />
                )}
                <span>{isSendingEmail ? 'Mengirim...' : 'Kirim ke Email'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Pengaturan Dasar</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Pilih Karyawan</label>
                  <div className="relative group">
                    <select 
                      value={payrollConfig.empId} 
                      onChange={(e) => setPayrollConfig({...payrollConfig, empId: e.target.value})}
                      className={selectModernClass.replace('pl-10', 'pl-4')}
                    >
                      <option value="">-- Pilih Karyawan --</option>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gaji Pokok (Rp)</label>
                      <input type="number" value={payrollConfig.gajiPokok || ''} onChange={(e) => setPayrollConfig({...payrollConfig, gajiPokok: Number(e.target.value) || 0})} className={inputModernClass.replace('pl-10', 'pl-4')} />
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tunjangan (Rp)</label>
                      <input type="number" value={payrollConfig.tunjangan || ''} onChange={(e) => setPayrollConfig({...payrollConfig, tunjangan: Number(e.target.value) || 0})} className={inputModernClass.replace('pl-10', 'pl-4')} />
                   </div>
                </div>
                
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex justify-between items-center mt-2">
                   <span className="text-xs font-medium text-blue-700">Tarif Harian (Gaji/26)</span>
                   <span className="text-sm font-bold text-blue-800">{formatRupiah(dailyRate)}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 mt-4">
                   <label className="block text-xs font-medium text-gray-700 mb-1">Input Manual Jumlah Alfa (Mangkir)</label>
                   <input type="number" value={payrollConfig.manualAlfa || ''} onChange={(e) => setPayrollConfig({...payrollConfig, manualAlfa: Number(e.target.value) || 0})} className={inputModernClass.replace('pl-10', 'pl-4')} />
                   <p className="text-[10px] text-gray-400 mt-1">Diperlukan jika karyawan tidak absen sama sekali di sistem.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {selectedEmp ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-800">Slip Gaji Internal</h3>
                      <p className="text-sm font-bold text-blue-600 mt-1">{selectedEmp.name}</p>
                      <p className="text-xs text-gray-500">{selectedEmp.role} - Email: {selectedEmp.email || 'Tidak ada email'}</p>
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm text-blue-600 p-3 rounded-2xl">
                      <WalletCards size={28} />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 mb-6 bg-gray-50 p-4 rounded-xl text-center divide-x divide-gray-200 border border-gray-100">
                    <div><p className="text-xs text-gray-500">Hadir</p><p className="font-bold text-gray-800">{stats.hadir}x</p></div>
                    <div><p className="text-xs text-gray-500">Lembur</p><p className="font-bold text-blue-600">{stats.lembur}x</p></div>
                    <div><p className="text-xs text-gray-500">Sakit</p><p className="font-bold text-orange-500">{stats.sakit}x</p></div>
                    <div><p className="text-xs text-gray-500">Izin</p><p className="font-bold text-orange-500">{stats.izin}x</p></div>
                    <div><p className="text-xs text-gray-500">Alfa</p><p className="font-bold text-red-500">{stats.alfa}x</p></div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">Pendapatan</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Gaji Pokok</span><span className="font-medium">{formatRupiah(payrollConfig.gajiPokok)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Tunjangan Tetap</span><span className="font-medium">{formatRupiah(payrollConfig.tunjangan)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Uang Lembur ({stats.lembur} hari)</span><span className="font-medium text-green-600">+ {formatRupiah(nominalLembur)}</span></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">Potongan</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sakit (Gratis 3 Hari, dipotong {potongSakitHari} hari)</span>
                          <span className="font-medium text-red-500">- {formatRupiah(nominalPotongSakit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Izin ({stats.izin} hari)</span>
                          <span className="font-medium text-red-500">- {formatRupiah(nominalPotongIzin)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Alfa / Tanpa Keterangan ({stats.alfa} hari)</span>
                          <span className="font-medium text-red-500">- {formatRupiah(nominalPotongAlfa)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t-2 border-dashed border-gray-300">
                      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <span className="text-lg font-bold text-blue-900">Total Take Home Pay</span>
                        <span className="text-2xl font-black text-blue-600">{formatRupiah(totalGajiBersih)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
               <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                  <WalletCards size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-600">Belum Ada Karyawan Terpilih</h3>
                  <p className="text-sm text-gray-400 max-w-xs mt-2">Pilih karyawan dari daftar pengaturan di sebelah kiri untuk melihat dan menghitung rincian gaji.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Views ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Briefcase className="text-white" size={32} />
              </div>
              <span className="text-3xl font-black text-gray-800 tracking-tight">Hadir<span className="text-blue-600">Ku</span></span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Login Portal</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Masukkan ID dan PIN Anda</p>

          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
              <AlertCircle size={16} /> {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Pengguna</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                </div>
                <input 
                  type="text" 
                  className={inputModernClass}
                  placeholder="Contoh: EMP-001"
                  value={loginForm.id}
                  onChange={(e) => setLoginForm({...loginForm, id: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Keamanan</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                </div>
                <input 
                  type="password" 
                  className={inputModernClass}
                  placeholder="****"
                  value={loginForm.pin}
                  onChange={(e) => setLoginForm({...loginForm, pin: e.target.value})}
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 mt-4 active:scale-[0.98]"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-xs text-yellow-800 border border-yellow-100">
            <strong>Kredensial Demo:</strong> 
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li><strong>Karyawan:</strong> <code>EMP-001</code> | PIN <code>1234</code> (Budi)</li>
              <li><strong>Karyawan:</strong> <code>EMP-002</code> | PIN <code>5678</code> (Siti)</li>
              <li><strong>Admin:</strong> <code>ADMIN-001</code> | PIN <code>8888</code></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // --- Views: Karyawan Dashboard ---
  const renderDashboard = () => {
    const y = currentTime.getFullYear();
    const m = String(currentTime.getMonth() + 1).padStart(2, '0');
    const d = String(currentTime.getDate()).padStart(2, '0');
    const todayDateString = `${y}-${m}-${d}`;
    const todayHoliday = holidays.find(h => h.date === todayDateString);

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Halo, {user?.name}! 👋</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-500 text-sm">{user?.jobRole} - {user?.storeName}</span>
              {selectedShift && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    selectedShift === 'Pagi' ? 'bg-blue-100 text-blue-700' :
                    selectedShift === 'Siang' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    Shift {selectedShift}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-3xl font-bold text-blue-600 tracking-tight">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-gray-500 font-medium mt-1">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-semibold text-gray-800">Panel Kehadiran</h3>
          </div>
          
          <div className="p-8 flex flex-col items-center justify-center">
            
            {todayHoliday && (
              <div className="w-full max-w-md bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 flex items-center gap-4 animate-pulse">
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                  <Palmtree size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900">Info: {todayHoliday.name}</h4>
                  <p className="text-xs text-indigo-700 mt-0.5">Status kehadiran Anda hari ini akan dicatat sebagai Lembur Libur.</p>
                </div>
              </div>
            )}

            {attendanceState === 'out' && !todayLog.out && (
              <div className="w-full max-w-md mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-3 text-center">Tentukan Jadwal Anda Hari Ini:</label>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setSelectedShift('Pagi')} className={`py-3 rounded-xl font-bold border transition-all flex flex-col items-center gap-1 ${selectedShift === 'Pagi' ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-105' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                    <Sun size={20} className={selectedShift === 'Pagi' ? 'text-white' : 'text-orange-500'} /> Pagi
                  </button>
                  <button onClick={() => setSelectedShift('Siang')} className={`py-3 rounded-xl font-bold border transition-all flex flex-col items-center gap-1 ${selectedShift === 'Siang' ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30 scale-105' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                    <Moon size={20} className={selectedShift === 'Siang' ? 'text-white' : 'text-blue-500'} /> Siang
                  </button>
                  <button onClick={() => setSelectedShift('Libur')} className={`py-3 rounded-xl font-bold border transition-all flex flex-col items-center gap-1 ${selectedShift === 'Libur' ? 'bg-gray-800 text-white border-gray-800 shadow-md shadow-gray-500/30 scale-105' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                    <Palmtree size={20} className={selectedShift === 'Libur' ? 'text-white' : 'text-green-500'} /> Libur
                  </button>
                </div>
                {selectedShift === 'Pagi' && <p className="text-xs text-blue-600 mt-3 text-center font-medium animate-in slide-in-from-top-2">Waktu Absen: 07:45 - 08:05</p>}
                {selectedShift === 'Siang' && <p className="text-xs text-amber-600 mt-3 text-center font-medium animate-in slide-in-from-top-2">Waktu Absen: 13:45 - 14:05</p>}
              </div>
            )}

            {attendanceState !== 'done' && selectedShift !== 'Libur' && selectedShift !== '' && (
              <div className={`flex flex-col items-center p-4 rounded-xl mb-8 w-full max-w-md border animate-in fade-in ${
                locationError ? 'bg-red-50 border-red-100' :
                distanceToStore === null ? 'bg-yellow-50 border-yellow-100' :
                (distanceToStore !== null && distanceToStore <= MAX_RADIUS) ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} className={locationError ? 'text-red-500' : (distanceToStore !== null && distanceToStore <= MAX_RADIUS) ? 'text-green-600' : 'text-orange-500'} />
                  <span className="font-semibold text-gray-800">Status Lokasi GPS</span>
                </div>
                
                {locationError ? (
                  <p className="text-sm text-red-600 text-center">{locationError}</p>
                ) : distanceToStore === null ? (
                  <p className="text-sm text-yellow-600 text-center">Sedang mencari sinyal GPS...</p>
                ) : (
                  <div className="text-center">
                    <p className={`text-sm font-medium ${(distanceToStore !== null && distanceToStore <= MAX_RADIUS) ? 'text-green-700' : 'text-orange-700'}`}>
                      Jarak Anda: {distanceToStore} meter dari toko.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">(Batas maksimal: {MAX_RADIUS} meter)</p>
                  </div>
                )}
              </div>
            )}

            {(attendanceState === 'in' || attendanceState === 'done') && (
              <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-md mb-8 animate-in zoom-in-95">
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Jam Masuk</p>
                  <p className="text-2xl font-bold text-gray-800">{todayLog.in || '--:--'}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Jam Pulang</p>
                  <p className="text-2xl font-bold text-gray-800">{todayLog.out || '--:--'}</p>
                </div>
              </div>
            )}

            {attendanceState === 'out' && !todayLog.out ? (
              selectedShift === 'Libur' ? (
                <button onClick={handleSetLibur} className="group relative px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-bold text-lg shadow-lg shadow-gray-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2 animate-in slide-in-from-bottom-4">
                  <Palmtree size={24} /> <span>Konfirmasi Jadwal Libur</span>
                </button>
              ) : selectedShift ? (
                <button 
                  onClick={() => handleClockAction('in')}
                  disabled={(distanceToStore !== null && distanceToStore > MAX_RADIUS) || distanceToStore === null}
                  className={`group relative px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-200 transform flex items-center space-x-2 animate-in slide-in-from-bottom-4
                    ${((distanceToStore !== null && distanceToStore > MAX_RADIUS) || distanceToStore === null) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-blue-500/30'}`}
                >
                  <Clock className={(distanceToStore !== null && distanceToStore <= MAX_RADIUS) ? "animate-pulse" : ""} size={24} />
                  <span>Clock In Sekarang</span>
                </button>
              ) : (
                <div className="text-sm text-gray-400 italic bg-gray-50 px-6 py-3 rounded-full border border-gray-100">Pilih shift di atas untuk memunculkan tombol absen</div>
              )
            ) : attendanceState === 'in' ? (
              <button 
                onClick={() => handleClockAction('out')}
                disabled={(distanceToStore !== null && distanceToStore > MAX_RADIUS) || distanceToStore === null}
                className={`group relative px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-200 transform flex items-center space-x-2 animate-in zoom-in
                  ${((distanceToStore !== null && distanceToStore > MAX_RADIUS) || distanceToStore === null) 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 active:scale-95 shadow-red-500/30'}`}
              >
                <LogOut size={24} />
                <span>Clock Out</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-6 py-4 rounded-xl border border-green-100 animate-in zoom-in-95">
                <CheckCircle size={24} />
                <span className="font-bold">{todayLog.status === 'Libur Shift' ? 'Anda Sedang Libur/Off Hari Ini' : 'Absensi Selesai Untuk Hari Ini'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeHistory = () => {
    const myHistory = reports.filter(r => r.empId === user?.id);

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Riwayat Absensi</h2>
            <p className="text-sm text-gray-500 mt-1">Daftar kehadiran harian Anda sebelumnya.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Jam Masuk</th>
                  <th className="p-4 font-medium">Jam Pulang</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myHistory.map((rep) => (
                  <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800">{rep.date}</td>
                    <td className="p-4 text-sm text-gray-600">{rep.in}</td>
                    <td className="p-4 text-sm text-gray-600">{rep.out}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        rep.status.includes('Tepat') ? 'bg-green-100 text-green-700' : 
                        rep.status.includes('Libur') ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                        {rep.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {myHistory.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">Anda belum memiliki riwayat absensi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeLeaves = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pengajuan Izin, Cuti & Lembur</h2>
          <p className="text-sm text-gray-500 mt-1">Ajukan permohonan ke HRD melalui formulir di bawah ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">Form Pengajuan Baru</h3>
          <form onSubmit={handleLeaveSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Pengajuan</label>
              <div className="relative group">
                <select value={leaveForm.type} onChange={(e: any) => setLeaveForm({...leaveForm, type: e.target.value, attachment: null})} required className={selectModernClass.replace('pl-10', 'pl-4')}>
                  <option value="Sakit">Sakit</option>
                  <option value="Izin">Izin (Keperluan Pribadi)</option>
                  <option value="Cuti Tahunan">Cuti Tahunan</option>
                  <option value="Cuti Menikah/Melahirkan">Cuti Menikah/Melahirkan</option>
                  <option value="Lembur">Kerja Lembur</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                </div>
              </div>
            </div>
            
            {leaveForm.type === 'Sakit' && (
              <div className="animate-in fade-in zoom-in duration-200">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  Lampiran Bukti (Surat Dokter) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                />
                {leaveForm.attachment && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Preview Bukti:</p>
                    <img src={leaveForm.attachment} alt="Preview Bukti" className="h-24 w-auto rounded-lg border border-gray-200 object-cover shadow-sm" />
                  </div>
                )}
              </div>
            )}

            {leaveForm.type === 'Lembur' ? (
              <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Lembur</label>
                  <input type="date" value={leaveForm.startDate} onChange={(e: any) => setLeaveForm({...leaveForm, startDate: e.target.value})} required className={inputModernClass.replace('pl-10', 'pl-4')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Jam & Keterangan Kerja</label>
                  <textarea value={leaveForm.reason} onChange={(e: any) => setLeaveForm({...leaveForm, reason: e.target.value})} required rows={3} className={`${inputModernClass.replace('pl-10', 'pl-4')} resize-none`} placeholder="Contoh: 15:30 - 18:30, Lembur stok opname akhir bulan..." />
                </div>
              </div>
            ) : (
              <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mulai Tanggal</label>
                  <input type="date" value={leaveForm.startDate} onChange={(e: any) => setLeaveForm({...leaveForm, startDate: e.target.value})} required className={inputModernClass.replace('pl-10', 'pl-4')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sampai Tanggal</label>
                  <input type="date" value={leaveForm.endDate} onChange={(e: any) => setLeaveForm({...leaveForm, endDate: e.target.value})} required className={inputModernClass.replace('pl-10', 'pl-4')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Lengkap</label>
                  <textarea value={leaveForm.reason} onChange={(e: any) => setLeaveForm({...leaveForm, reason: e.target.value})} required rows={3} className={`${inputModernClass.replace('pl-10', 'pl-4')} resize-none`} placeholder="Tuliskan keterangan lengkap..." />
                </div>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-500/30 flex justify-center items-center gap-2 mt-2">
              <Save size={18} /> Kirim Pengajuan
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-800">Riwayat Pengajuan Saya</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="p-4 font-medium">Jenis</th>
                  <th className="p-4 font-medium">Tanggal/Waktu</th>
                  <th className="p-4 font-medium">Keterangan</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaveRequests.filter(req => req.empId === user?.id).map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-800">
                      <span className={req.type === 'Lembur' ? 'text-blue-600' : 'text-gray-800'}>{req.type}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {req.startDate} 
                      {req.type !== 'Lembur' && req.startDate !== req.endDate && (
                        <span>
                          <br/>
                          <span className="text-xs text-gray-400">s/d</span> {req.endDate}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={req.reason}>{req.reason}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 
                        req.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {leaveRequests.filter(req => req.empId === user?.id).length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada riwayat pengajuan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Views: Admin ---
  const renderAdminDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Panel Admin 👋</h2>
          <p className="text-gray-500 mt-1">Pusat laporan dan persetujuan absensi.</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-3xl font-bold text-blue-600 tracking-tight">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('admin-employees')}>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
          <div><p className="text-gray-500 text-sm">Total Karyawan</p><p className="text-2xl font-bold">{employees.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('admin-payroll')}>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><WalletCards size={24} /></div>
          <div><p className="text-gray-500 text-sm">Hitung Gaji</p><p className="text-2xl font-bold">Payroll</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('admin-reports')}>
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><FileText size={24} /></div>
          <div><p className="text-gray-500 text-sm">Total Laporan</p><p className="text-2xl font-bold">{reports.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('admin-leaves')}>
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><CalendarDays size={24} /></div>
          <div><p className="text-gray-500 text-sm">Pengajuan Pending</p><p className="text-2xl font-bold">{leaveRequests.filter(r => r.status === 'Pending').length}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">Log Absensi Terkini</h3>
          <button onClick={() => setActiveTab('admin-reports')} className="text-blue-600 text-sm font-medium hover:underline flex items-center transition-all">Lihat Semua <ChevronRight size={16}/></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Karyawan</th>
                <th className="p-4 font-medium">Lokasi Toko</th>
                <th className="p-4 font-medium">Jam Masuk</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.slice(0, 3).map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-gray-800">{emp.name}</td>
                  <td className="p-4 text-sm text-gray-600 flex items-center gap-2"><MapPin size={14} className="text-gray-400"/> {emp.store}</td>
                  <td className="p-4 text-sm text-gray-600">{emp.in}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        emp.status.includes('Tepat') ? 'bg-green-100 text-green-700' : 
                        emp.status.includes('Libur') ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdminRoles = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pengaturan Jabatan</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar jabatan untuk pilihan posisi karyawan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="font-bold text-gray-800 mb-4">Tambah Jabatan Baru</h3>
          <form onSubmit={handleAddRole} className="space-y-4">
            <div>
              <input 
                type="text" 
                value={newRole} 
                onChange={(e: any) => setNewRole(e.target.value)} 
                required 
                className={inputModernClass.replace('pl-10', 'pl-4')}
                placeholder="Contoh: IT Support" 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-500/30 flex justify-center items-center gap-2">
              <Plus size={18} /> Tambah Jabatan
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-800">Daftar Jabatan Tersedia ({roles.length})</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {roles.map((role, idx) => (
              <li key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                    <Tag size={16} />
                  </div>
                  <span className="font-bold text-gray-700">{role}</span>
                </div>
                <button 
                  onClick={() => handleDeleteRole(role)} 
                  className="p-2 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors" 
                  title="Hapus Jabatan"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
            {roles.length === 0 && (
               <li className="p-8 text-center text-gray-500">Belum ada data jabatan.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAdminEmployees = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Data Karyawan</h2>
          <p className="text-sm text-gray-500 mt-1">Daftar anggota tim yang terdaftar di dalam sistem.</p>
        </div>
        <button onClick={() => openEmpModal()} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md shadow-blue-500/30">
          <Plus size={18} /> <span>Tambah Karyawan</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari ID atau Nama..." 
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className={inputModernClass}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">ID & Nama</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Jabatan</th>
                <th className="p-4 font-medium">Penempatan Toko</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{emp.id}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {emp.email ? <a href={`mailto:${emp.email}`} className="text-blue-600 hover:underline">{emp.email}</a> : <span className="italic text-gray-400">Tidak ada</span>}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">{emp.role}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <MapPin size={14} className="text-gray-400"/> {emp.store}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => openEmpModal(emp)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit"><Edit size={18}/></button>
                      <button onClick={() => deleteEmp(emp.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Karyawan tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdminReports = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Laporan Kehadiran Harian</h2>
          <p className="text-sm text-gray-500 mt-1">Pantau rekapan absensi harian (Clock In/Out) karyawan.</p>
        </div>
        <button onClick={exportReport} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md shadow-green-500/30">
          <FileText size={18} /> <span>Export ke Excel</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50/50 items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 font-medium w-full sm:w-auto mb-2 sm:mb-0">
            <Filter size={18} className="text-blue-500" />
            <span>Filter Laporan</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              </div>
              <input 
                type="date" 
                className={inputModernClass}
                value={reportFilterDate}
                onChange={(e: any) => setReportFilterDate(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-auto group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              </div>
              <select 
                className={selectModernClass}
                value={reportFilterStore}
                onChange={(e: any) => setReportFilterStore(e.target.value)}
              >
                <option value="Semua Toko">Semua Cabang Toko</option>
                {stores.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Nama Karyawan</th>
                <th className="p-4 font-medium">Lokasi Toko</th>
                <th className="p-4 font-medium">Jam Masuk</th>
                <th className="p-4 font-medium">Jam Pulang</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReports.length > 0 ? filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-600">{rep.date}</td>
                  <td className="p-4 text-sm font-bold text-gray-800">{rep.name}</td>
                  <td className="p-4 text-sm text-gray-600">{rep.store}</td>
                  <td className="p-4 text-sm font-bold text-gray-800">{rep.in}</td>
                  <td className="p-4 text-sm font-bold text-gray-800">{rep.out}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        rep.status.includes('Tepat') ? 'bg-green-100 text-green-700' : 
                        rep.status.includes('Libur') ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Tidak ada laporan absensi untuk filter ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdminLeaves = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kelola Izin, Cuti & Lembur</h2>
          <p className="text-sm text-gray-500 mt-1">Persetujuan dari pengajuan karyawan beserta bukti lampirannya.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">ID & Nama</th>
                <th className="p-4 font-medium">Jenis Pengajuan</th>
                <th className="p-4 font-medium">Tanggal / Waktu</th>
                <th className="p-4 font-medium w-1/4">Keterangan</th>
                <th className="p-4 font-medium text-center">Lampiran</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-800">{req.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{req.empId}</p>
                  </td>
                  <td className="p-4 text-sm font-bold text-blue-700">{req.type}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {req.startDate} 
                    {req.type !== 'Lembur' && req.startDate !== req.endDate && (
                      <span>
                        <br/>
                        <span className="text-xs text-gray-400">s/d</span> {req.endDate}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <p className="line-clamp-2" title={req.reason}>{req.reason}</p>
                  </td>
                  <td className="p-4 text-center">
                    {req.type === 'Sakit' ? (
                      req.attachment ? (
                        <button onClick={() => setViewAttachmentUrl(req.attachment)} className="mx-auto text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100">
                          <ImageIcon size={14} /> Lihat Foto
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Tidak ada foto</span>
                      )
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      req.status === 'Disetujui' ? 'bg-green-100 text-green-700' : 
                      req.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => handleUpdateLeaveStatus(req.id, 'Disetujui')} className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 font-medium rounded-lg text-xs transition-colors flex items-center gap-1 border border-green-100">
                          <Check size={14}/> Setujui
                        </button>
                        <button onClick={() => handleUpdateLeaveStatus(req.id, 'Ditolak')} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium rounded-lg text-xs transition-colors flex items-center gap-1 border border-red-100">
                          <X size={14}/> Tolak
                        </button>
                      </div>
                    ) : (
                       <div className="text-center text-xs text-gray-400 font-medium">- Selesai -</div>
                    )}
                  </td>
                </tr>
              ))}
              {leaveRequests.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Tidak ada permohonan pengajuan saat ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdminStores = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pengaturan Toko (GPS)</h2>
          <p className="text-sm text-gray-500 mt-1">Atur titik koordinat dan toleransi radius area absensi.</p>
        </div>
        <button onClick={() => openStoreModal()} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md shadow-blue-500/30">
          <Plus size={18} /> <span>Tambah Cabang</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mt-1 shrink-0">
                <MapPin size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{store.name}</h3>
                    <p className="text-sm text-gray-400 font-mono mt-0.5">ID: {store.id}</p>
                  </div>
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md border border-green-200">Aktif</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Latitude</span>
                <span className="font-mono font-medium text-gray-800">{store.lat}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Longitude</span>
                <span className="font-mono font-medium text-gray-800">{store.lng}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                <span className="text-gray-500">Batas Jarak Absen</span>
                <span className="font-bold text-blue-600">{store.radius} Meter</span>
              </div>
            </div>

            <div className="flex space-x-3 w-full">
              <button onClick={() => openStoreModal(store)} className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm">
                <Edit size={16}/> Edit
              </button>
              <button onClick={() => deleteStore(store.id)} className="flex-1 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex justify-center items-center gap-2">
                <Trash2 size={16}/> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdminHolidays = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pengaturan Hari Libur</h2>
          <p className="text-sm text-gray-500 mt-1">Kalender untuk hari libur nasional atau acara perusahaan.</p>
        </div>
        <button onClick={() => openHolidayModal()} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md shadow-indigo-500/30">
          <Plus size={18} /> <span>Tambah Libur</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium w-48">Tanggal Libur</th>
                <th className="p-4 font-medium">Keterangan / Nama Libur</th>
                <th className="p-4 font-medium text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {holidays.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((hol) => (
                <tr key={hol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-indigo-600">
                    {new Date(hol.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-800">{hol.name}</td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => openHolidayModal(hol)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors" title="Edit"><Edit size={18}/></button>
                      <button onClick={() => deleteHoliday(hol.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {holidays.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-gray-500">Belum ada hari libur yang diatur.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* --- Sidebar & Navigation --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg"><Briefcase className="text-white" size={24} /></div>
            <span className="text-2xl font-black text-gray-800 tracking-tight">Hadir<span className="text-blue-600">Ku</span></span>
            {user?.role === 'admin' && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-md border border-red-200">ADMIN</span>}
          </div>
          <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {user?.role === 'admin' ? (
            <>
              <button onClick={() => {setActiveTab('admin-dashboard'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <Home size={20} /> <span className="font-medium">Dashboard Admin</span>
              </button>
              <button onClick={() => {setActiveTab('admin-employees'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-employees' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <Users size={20} /> <span className="font-medium">Data Karyawan</span>
              </button>
              <button onClick={() => {setActiveTab('admin-roles'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-roles' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <Tag size={20} /> <span className="font-medium">Pengaturan Jabatan</span>
              </button>
              <button onClick={() => {setActiveTab('admin-payroll'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-payroll' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-emerald-700 hover:bg-emerald-50'}`}>
                <WalletCards size={20} /> <span className="font-medium">Hitung Gaji (Payroll)</span>
              </button>
              <button onClick={() => {setActiveTab('admin-reports'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-reports' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <Database size={20} /> <span className="font-medium">Laporan Absensi</span>
              </button>
              <button onClick={() => {setActiveTab('admin-leaves'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-leaves' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <CalendarDays size={20} /> <span className="font-medium">Kelola Pengajuan</span>
              </button>
              <button onClick={() => {setActiveTab('admin-stores'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-stores' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <Settings size={20} /> <span className="font-medium">Pengaturan Toko</span>
              </button>
              <button onClick={() => {setActiveTab('admin-holidays'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'admin-holidays' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <Palmtree size={20} /> <span className="font-medium">Pengaturan Libur</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => {setActiveTab('dashboard'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <Home size={20} /> <span className="font-medium">Dashboard Kehadiran</span>
              </button>
              <button onClick={() => {setActiveTab('employee-history'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'employee-history' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <History size={20} /> <span className="font-medium">Riwayat Absensi</span>
              </button>
              <button onClick={() => {setActiveTab('employee-leave'); setIsMobileMenuOpen(false);}} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'employee-leave' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
                <CalendarDays size={20} /> <span className="font-medium">Izin, Cuti & Lembur</span>
              </button>
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-2 hover:bg-red-50 rounded-lg transition-colors group">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-red-200 transition-colors">
              {user?.name?.charAt(0)}
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-gray-800 group-hover:text-red-600 transition-colors">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.id}</p>
            </div>
            <LogOut size={18} className="text-gray-400 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-h-screen max-h-screen overflow-y-auto">
        <header className="md:hidden bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Briefcase className="text-white" size={20} /></div>
            <span className="text-xl font-black text-gray-800">Hadir<span className="text-blue-600">Ku</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 p-2 hover:bg-gray-50 rounded-lg"><Menu size={24} /></button>
        </header>

        <div className="p-4 md:p-8 flex-1">
          <div className="max-w-6xl mx-auto">
            {/* Employee Views */}
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'employee-history' && renderEmployeeHistory()}
            {activeTab === 'employee-leave' && renderEmployeeLeaves()}

            {/* Admin Views */}
            {activeTab === 'admin-dashboard' && renderAdminDashboard()}
            {activeTab === 'admin-payroll' && renderAdminPayroll()}
            {activeTab === 'admin-employees' && renderAdminEmployees()}
            {activeTab === 'admin-roles' && renderAdminRoles()}
            {activeTab === 'admin-reports' && renderAdminReports()}
            {activeTab === 'admin-leaves' && renderAdminLeaves()}
            {activeTab === 'admin-stores' && renderAdminStores()}
            {activeTab === 'admin-holidays' && renderAdminHolidays()}
          </div>
        </div>
      </main>

      {/* --- Modals --- */}

      {/* Modal View Image (Lampiran) */}
      {viewAttachmentUrl && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setViewAttachmentUrl(null)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewAttachmentUrl(null)} className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors">
              <X size={24}/>
            </button>
            <img src={viewAttachmentUrl} alt="Lampiran Bukti" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
      
      {/* Modal Karyawan */}
      {showEmpModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-800">{isEditingEmp ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}</h3>
              <button onClick={() => setShowEmpModal(false)} className="text-gray-400 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={saveEmp} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Karyawan</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <User className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                   </div>
                   <input type="text" value={empForm.id} onChange={(e: any) => setEmpForm({...empForm, id: e.target.value})} required disabled={isEditingEmp} className={`${inputModernClass} uppercase placeholder-gray-400 ${isEditingEmp ? 'bg-gray-100 text-gray-500 cursor-not-allowed shadow-none' : ''}`} placeholder="Contoh: EMP-004" />
                </div>
                {isEditingEmp && <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> ID Karyawan bersifat permanen.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" value={empForm.name} onChange={(e: any) => setEmpForm({...empForm, name: e.target.value})} required className={inputModernClass} placeholder="Masukkan nama lengkap..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Mail className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                   </div>
                   <input type="email" value={empForm.email || ''} onChange={(e: any) => setEmpForm({...empForm, email: e.target.value})} className={inputModernClass} placeholder="Contoh: email@perusahaan.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN / Password Login</label>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Lock className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                   </div>
                   <input type="text" value={empForm.pin || ''} onChange={(e: any) => setEmpForm({...empForm, pin: e.target.value})} required className={inputModernClass} placeholder="Contoh: 1234" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Gunakan kombinasi angka atau huruf yang mudah diingat.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Jabatan</label>
                  <div className="relative group">
                    <select value={empForm.role} onChange={(e: any) => setEmpForm({...empForm, role: e.target.value})} required className={`${selectModernClass} pr-6`}>
                      <option value="" disabled>Pilih...</option>
                      {roles.map((r, i) => <option key={i} value={r}>{r}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <ChevronDown className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penempatan</label>
                  <div className="relative group">
                    <select value={empForm.store} onChange={(e: any) => setEmpForm({...empForm, store: e.target.value})} className={`${selectModernClass} pr-6`}>
                      {stores.map(st => <option key={st.id} value={st.name}>{st.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <ChevronDown className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowEmpModal(false)} className="px-5 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-colors shadow-sm">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/30 flex items-center gap-2 active:scale-[0.98]"><Save size={18}/> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Toko */}
      {showStoreModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-800">{isEditingStore ? 'Edit Cabang Toko' : 'Tambah Cabang Baru'}</h3>
              <button onClick={() => setShowStoreModal(false)} className="text-gray-400 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={saveStore} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Cabang</label>
                <input type="text" value={storeForm.id} disabled className="w-full pl-4 pr-4 py-2.5 border border-gray-200 bg-gray-100 rounded-xl text-gray-500 outline-none font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Cabang / Toko</label>
                <input type="text" value={storeForm.name} onChange={(e: any) => setStoreForm({...storeForm, name: e.target.value})} required className={inputModernClass.replace('pl-10', 'pl-4')} placeholder="Contoh: Cabang Bekasi" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
                  <input type="text" value={storeForm.lat} onChange={(e: any) => setStoreForm({...storeForm, lat: e.target.value})} required className={`${inputModernClass.replace('pl-10', 'pl-4')} font-mono text-sm`} placeholder="-6.12345" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
                  <input type="text" value={storeForm.lng} onChange={(e: any) => setStoreForm({...storeForm, lng: e.target.value})} required className={`${inputModernClass.replace('pl-10', 'pl-4')} font-mono text-sm`} placeholder="106.12345" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Batas Radius Absen (Meter)</label>
                <input type="number" value={storeForm.radius} onChange={(e: any) => setStoreForm({...storeForm, radius: Number(e.target.value)})} required className={inputModernClass.replace('pl-10', 'pl-4')} min={10} />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowStoreModal(false)} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-colors shadow-sm">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/30 flex items-center gap-2 active:scale-[0.98]"><Save size={18}/> Simpan Toko</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hari Libur */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-indigo-50/50">
              <h3 className="font-bold text-lg text-indigo-900">{isEditingHoliday ? 'Edit Hari Libur' : 'Tambah Hari Libur'}</h3>
              <button onClick={() => setShowHolidayModal(false)} className="text-gray-400 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={saveHoliday} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Libur</label>
                <input type="date" value={holidayForm.date} onChange={(e: any) => setHolidayForm({...holidayForm, date: e.target.value})} required className={inputModernClass.replace('pl-10', 'pl-4')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan / Nama Libur</label>
                <input type="text" value={holidayForm.name} onChange={(e: any) => setHolidayForm({...holidayForm, name: e.target.value})} required className={inputModernClass.replace('pl-10', 'pl-4')} placeholder="Contoh: Idul Fitri, Hari Buruh..." />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowHolidayModal(false)} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-colors shadow-sm">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-500/30 flex items-center gap-2 active:scale-[0.98]"><Save size={18}/> Simpan Libur</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal Pop-up Custom untuk Alert & Confirm --- */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 p-6 text-center relative">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-inner ${dialog.type === 'confirm' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
              <AlertCircle size={32} />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">{dialog.title}</h3>
            <p className="text-gray-500 text-sm mb-8 px-2">{dialog.message}</p>
            <div className="flex justify-center gap-3 w-full">
              {dialog.type === 'confirm' && (
                <button onClick={closeDialog} className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
                  Batal
                </button>
              )}
              <button 
                onClick={() => {
                  if (dialog.type === 'confirm' && dialog.onConfirm) {
                    (dialog.onConfirm as Function)();
                  }
                  closeDialog();
                }} 
                className={`flex-1 py-3 text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98] ${dialog.type === 'confirm' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
              >
                {dialog.type === 'confirm' ? 'Konfirmasi' : 'Mengerti'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}