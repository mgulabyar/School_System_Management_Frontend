import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Tabs, Tab, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Alert, CircularProgress, Snackbar,
  Select, MenuItem, FormControl, InputLabel, Divider
} from '@mui/material';
import axios from 'axios';
import { useCustomTheme } from '../context/ThemeContext';
import { getStudents } from '../services/studentService';
import { addVehicle, getVehicles, createRoute, getRoutes, allocateTransport, cancelAllocation, getTransportReport } from '../services/transportService';

interface VehicleData {
  _id: string;
  vehicleNo: string;
  registrationNo: string;
  driverName: string;
  driverPhone: string;
}

interface RouteData {
  _id: string;
  routeName: string;
  routeCost: number;
  stops: string[];
}

interface StudentData {
  _id: string;
  user: {
    name: string;
  };
  admissionNo: string;
}

interface AllocationRecord {
  _id: string;
  student: {
    _id: string;
    admissionNo: string;
    user: {
      name: string;
    };
  };
  route: {
    routeName: string;
    routeCost: number;
  };
  vehicle: {
    vehicleNo: string;
    driverName: string;
    driverPhone: string;
  };
  status: string;
}

export const Transport: React.FC = () => {
  const { mode } = useCustomTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Core Data Lists
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [allocations, setAllocations] = useState<AllocationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Floating Toast Notification States
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  // Form Inputs (Add Vehicle) [1]
  const [vehicleNo, setVehicleNo] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [capacity, setCapacity] = useState('');

  // Form Inputs (Create Route) [1]
  const [routeName, setRouteName] = useState('');
  const [routeCost, setRouteCost] = useState('');
  const [stopsText, setStopsText] = useState(''); // Comma-separated stop names

  // Form Inputs (Allocate Transport) [1]
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Interactive Button Loading States
  const [addVehicleLoading, setAddVehicleLoading] = useState(false);
  const [createRouteLoading, setCreateRouteLoading] = useState(false);
  const [allocateLoading, setAllocateLoading] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);

  // Load baseline vehicles, routes, active students, and allocations [1]
  const loadBaselineData = useCallback(async () => {
    try {
      setLoading(true);
      const resVehicles = await getVehicles();
      const resRoutes = await getRoutes();
      const resStudents = await getStudents();
      const resAllocations = await getTransportReport();

      setVehicles(resVehicles.data);
      setRoutes(resRoutes.data);
      setAllocations(resAllocations.data);
      
      // Filter only active students [1]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStudents(resStudents.data.filter((s: any) => s.status === 'Active'));
      setLoading(false);
    } catch {
      setLoading(false);
      setToastSeverity('error');
      setToastMessage('Failed to fetch baseline transport details.');
      setToastOpen(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBaselineData();
  }, [loadBaselineData]);

  // Handle Add Vehicle with 2s Delay [1]
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleNo || !registrationNo || !driverName || !driverPhone || !capacity) {
      setToastSeverity('error');
      setToastMessage('Please fill out all fields in the Vehicle Form!');
      setToastOpen(true);
      return;
    }

    setAddVehicleLoading(true);

    setTimeout(async () => {
      try {
        await addVehicle({
          vehicleNo,
          registrationNo,
          driverName,
          driverPhone,
          capacity: Number(capacity)
        });

        setToastSeverity('success');
        setToastMessage('Vehicle added successfully!');
        setToastOpen(true);

        setVehicleNo('');
        setRegistrationNo('');
        setDriverName('');
        setDriverPhone('');
        setCapacity('');
        setAddVehicleLoading(false);
        loadBaselineData(); // Refresh lists
      } catch (err: unknown) {
        setAddVehicleLoading(false);
        let msg = 'Failed to add vehicle.';
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity('error');
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  // Handle Create Route with 2s Delay [1]
  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();

    if (!routeName || !routeCost || !stopsText) {
      setToastSeverity('error');
      setToastMessage('Please enter Route Name, Monthly Cost, and Bus Stops!');
      setToastOpen(true);
      return;
    }

    setCreateRouteLoading(true);

    // Convert comma-separated string to clean trimmed array
    const stopsArray = stopsText.split(',').map(s => s.trim()).filter(Boolean);

    setTimeout(async () => {
      try {
        await createRoute({
          routeName,
          routeCost: Number(routeCost),
          stops: stopsArray
        });

        setToastSeverity('success');
        setToastMessage('Transport Route created successfully!');
        setToastOpen(true);

        setRouteName('');
        setRouteCost('');
        setStopsText('');
        setCreateRouteLoading(false);
        loadBaselineData(); // Refresh lists
      } catch (err: unknown) {
        setCreateRouteLoading(false);
        let msg = 'Failed to create route.';
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity('error');
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  // Handle Transport Allocation with 2s Delay [1]
  const handleAllocateTransport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudentId || !selectedRouteId || !selectedVehicleId) {
      setToastSeverity('error');
      setToastMessage('Please select Student, Route, and Vehicle!');
      setToastOpen(true);
      return;
    }

    setAllocateLoading(true);

    setTimeout(async () => {
      try {
        await allocateTransport({
          studentId: selectedStudentId,
          routeId: selectedRouteId,
          vehicleId: selectedVehicleId
        });

        setToastSeverity('success');
        setToastMessage('Transport allocated to student successfully!');
        setToastOpen(true);

        setSelectedStudentId('');
        setSelectedRouteId('');
        setSelectedVehicleId('');
        setAllocateLoading(false);
        loadBaselineData(); // Refresh lists
      } catch (err: unknown) {
        setAllocateLoading(false);
        let msg = 'Failed to allocate transport.';
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity('error');
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  // Handle Cancel Allocation with 2s Delay [1]
  const handleCancelAllocation = (allocationId: string) => {
    setCancelLoadingId(allocationId);

    setTimeout(async () => {
      try {
        await cancelAllocation(allocationId);
        setToastSeverity('success');
        setToastMessage('Student transport allocation cancelled successfully!');
        setToastOpen(true);
        setCancelLoadingId(null);
        loadBaselineData(); // Refresh lists
      } catch (err: unknown) {
        setCancelLoadingId(null);
        let msg = 'Failed to cancel allocation.';
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || msg;
        }
        setToastSeverity('error');
        setToastMessage(msg);
        setToastOpen(true);
      }
    }, 2000);
  };

  return (
   <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        '@keyframes pageSlideUp': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        animation: 'pageSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <Typography variant="h1" color="primary" sx={{ mb: 1, fontSize: '1.65rem', fontWeight: 800, fontFamily: '"Roboto", "Arial", sans-serif', letterSpacing: '-0.01em' }}>
        Transport Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '0.925rem', fontFamily: '"Roboto", "Arial", sans-serif' }}>
        Configure school vehicles, map transportation routes, and assign students.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)} 
          textColor="primary" 
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: "40px",
            "& .MuiTab-root": {
              minHeight: "40px",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: '"Roboto", "Arial", sans-serif',
              textTransform: "none",
              padding: "6px 16px"
            }
          }}
        >
          <Tab label="Add Vehicle" />
          <Tab label="Create Route" />
          <Tab label="Allocate Transport" />
          <Tab label="Transport Directory" />
        </Tabs>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity={toastSeverity} 
          sx={{ 
            width: '100%', 
            borderRadius: "10px", 
            fontFamily: '"Roboto", "Arial", sans-serif',
            boxShadow: mode === 'light' ? '0 10px 24px rgba(15, 23, 42, 0.08)' : 'none'
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      {activeTab === 0 && (
        <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', maxWidth: 600 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", mb: 3, fontFamily: '"Roboto", "Arial", sans-serif' }}>
              Add School Bus / Vehicle
            </Typography>

            <form onSubmit={handleAddVehicle}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3.5 }}>
                
                <TextField
                  label="Vehicle Number"
                  placeholder="Enter vehicle tag (e.g. Bus-01)"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  disabled={addVehicleLoading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
                    '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
                  }}
                />

                <TextField
                  label="Registration Number"
                  placeholder="Enter official registration plate"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  disabled={addVehicleLoading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
                    '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
                  }}
                />

                <TextField
                  label="Driver Name"
                  placeholder="Enter assigned driver name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  disabled={addVehicleLoading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
                    '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
                  }}
                />

                <TextField
                  label="Driver Phone"
                  placeholder="Enter driver mobile number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  disabled={addVehicleLoading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
                    '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
                  }}
                />

                <TextField
                  label="Seating Capacity"
                  placeholder="Enter total seating capacity"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  disabled={addVehicleLoading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
                    '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
                  }}
                />

              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={addVehicleLoading}
                sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
              >
                {addVehicleLoading ? <CircularProgress size={18} color="inherit" /> : 'Add Vehicle'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', maxWidth: 600 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", mb: 3, fontFamily: '"Roboto", "Arial", sans-serif' }}>
              Create Transport Route
            </Typography>

            <form onSubmit={handleCreateRoute}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3.5 }}>
                
                <TextField
                  label="Route Name"
                  placeholder="Enter route name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  disabled={createRouteLoading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
                    '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
                  }}
                />

                <TextField
                  label="Monthly Route Cost (Fare)"
                  placeholder="Enter monthly charges in Rs."
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={routeCost}
                  onChange={(e) => setRouteCost(e.target.value)}
                  disabled={createRouteLoading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { height: 42, borderRadius: "8px", fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px' },
                    '& .MuiInputLabel-root': { fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', transform: 'translate(14px, 12px) scale(1)' },
                    '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' }
                  }}
                />

                <TextField
                  label="Bus Stops (Comma-separated)"
                  placeholder="e.g., DHA Phase 3, Y Block, School Campus"
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                  value={stopsText}
                  onChange={(e) => setStopsText(e.target.value)}
                  disabled={createRouteLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      py: 1.5,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                    },
                  }}
                />

              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                color="secondary" 
                fullWidth 
                disabled={createRouteLoading}
                sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
              >
                {createRouteLoading ? <CircularProgress size={18} color="inherit" /> : 'Create Route'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', maxWidth: 500 }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", mb: 3, fontFamily: '"Roboto", "Arial", sans-serif' }}>
              Allocate Transport to Student
            </Typography>

            <form onSubmit={handleAllocateTransport}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3.5 }}>
                
                <FormControl size="small" fullWidth>
                  <InputLabel 
                    id="alloc-student-label" 
                    sx={{ 
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      }
                    }}
                  >
                    Select Student
                  </InputLabel>
                  <Select
                    labelId="alloc-student-label"
                    value={selectedStudentId}
                    label="Select Student"
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    disabled={allocateLoading}
                    sx={{ 
                      height: 42, 
                      borderRadius: "8px", 
                      fontFamily: '"Roboto", "Arial", sans-serif', 
                      fontSize: '13px',
                      "& .MuiSelect-select": {
                        paddingTop: "11px",
                        paddingBottom: "11px"
                      }
                    }}
                  >
                    {students.map((st) => (
                      <MenuItem key={st._id} value={st._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
                        {st.user.name} ({st.admissionNo})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel 
                    id="alloc-route-label" 
                    sx={{ 
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      }
                    }}
                  >
                    Select Route
                  </InputLabel>
                  <Select
                    labelId="alloc-route-label"
                    value={selectedRouteId}
                    label="Select Route"
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                    disabled={allocateLoading}
                    sx={{ 
                      height: 42, 
                      borderRadius: "8px", 
                      fontFamily: '"Roboto", "Arial", sans-serif', 
                      fontSize: '13px',
                      "& .MuiSelect-select": {
                        paddingTop: "11px",
                        paddingBottom: "11px"
                      }
                    }}
                  >
                    {routes.map((rt) => (
                      <MenuItem key={rt._id} value={rt._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
                        {rt.routeName} (Rs. {rt.routeCost}/mo)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel 
                    id="alloc-vehicle-label" 
                    sx={{ 
                      fontFamily: '"Roboto", "Arial", sans-serif',
                      fontSize: "13px",
                      transform: "translate(14px, 11px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -6px) scale(0.75)",
                      }
                    }}
                  >
                    Select Vehicle
                  </InputLabel>
                  <Select
                    labelId="alloc-vehicle-label"
                    value={selectedVehicleId}
                    label="Select Vehicle"
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    disabled={allocateLoading}
                    sx={{ 
                      height: 42, 
                      borderRadius: "8px", 
                      fontFamily: '"Roboto", "Arial", sans-serif', 
                      fontSize: '13px',
                      "& .MuiSelect-select": {
                        paddingTop: "11px",
                        paddingBottom: "11px"
                      }
                    }}
                  >
                    {vehicles.map((vh) => (
                      <MenuItem key={vh._id} value={vh._id} sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
                        {vh.vehicleNo} ({vh.driverName})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={allocateLoading}
                sx={{ height: 42, fontSize: "13px", borderRadius: "8px", textTransform: "none", boxShadow: "none", fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif' }}
              >
                {allocateLoading ? <CircularProgress size={18} color="inherit" /> : 'Allocate Transport'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 3 && (
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress size={28} />
            </Box>
          ) : allocations.length === 0 ? (
            <Card sx={{ borderRadius: "10px", border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', fontSize: "13px" }}>
                No active transport allocations registered in the system yet.
              </Typography>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Card sx={{ borderRadius: "10px", bgcolor: 'background.paper', boxShadow: mode === 'light' ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none', border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1', p: 1 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700, fontSize: "14px", p: 2, fontFamily: '"Roboto", "Arial", sans-serif' }}>
                      Transport Allocations Directory
                    </Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                      <Table sx={{ minWidth: 800 }}>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Admission No</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Student Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Assigned Route</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Vehicle / Bus</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>Driver Details</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }} align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allocations.map((record) => (
                            <TableRow key={record._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}>
                              <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{record.student.admissionNo}</TableCell>
                              <TableCell sx={{ fontWeight: 600, fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{record.student.user.name}</TableCell>
                              <TableCell sx={{ px: 2, borderBottomColor: 'divider', maxWidth: 150, whiteSpace: "nowrap" }}>
                                <Typography noWrap sx={{ fontWeight: 600, fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '13px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 150 }}>
                                  {record.route.routeName}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{record.vehicle.vehicleNo}</TableCell>
                              <TableCell sx={{ fontSize: "13px", fontFamily: '"Roboto", "Arial", sans-serif', borderBottomColor: 'divider', whiteSpace: "nowrap" }}>{record.vehicle.driverName} ({record.vehicle.driverPhone})</TableCell>
                              <TableCell align="right" sx={{ borderBottomColor: 'divider', whiteSpace: "nowrap" }}>
                                <Button 
                                  size="small" 
                                  variant="text" 
                                  color="error" 
                                  onClick={() => handleCancelAllocation(record._id)}
                                  disabled={cancelLoadingId === record._id}
                                  sx={{ fontWeight: 600, fontSize: "12px", textTransform: "none", fontFamily: '"Roboto", "Arial", sans-serif', minWidth: 60 }}
                                >
                                  {cancelLoadingId === record._id ? <CircularProgress size={14} color="inherit" /> : 'Cancel'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2.5 }}>
                {allocations.map((record) => (
                  <Card 
                    key={record._id} 
                    sx={{ 
                      p: 2, 
                      borderRadius: "10px", 
                      border: mode === 'dark' ? '1px solid #334155' : '1px solid #CBD5E1',
                      borderLeft: "5px solid",
                      borderLeftColor: "primary.main",
                      boxShadow: mode === 'light' ? '0 4px 12px rgba(15, 23, 42, 0.04)' : 'none',
                      bgcolor: 'background.paper',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: mode === "light" 
                          ? "0 12px 20px -5px rgba(15, 23, 42, 0.08)" 
                          : "0 4px 20px rgba(96, 165, 250, 0.1)",
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, fontFamily: '"Roboto", "Arial", sans-serif', color: 'text.secondary' }}>
                        {record.student.admissionNo}
                      </Typography>
                      <Typography 
                        component="span" 
                        sx={{ 
                          fontSize: '10px', 
                          fontWeight: 700, 
                          px: 1, 
                          py: 0.2, 
                          borderRadius: "4px",
                          bgcolor: 'action.selected',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          fontFamily: '"Roboto", "Arial", sans-serif'
                        }}
                      >
                        {record.status}
                      </Typography>
                    </Box>

                    <Typography noWrap sx={{ fontWeight: 700, fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '14px', mb: 0.5, color: 'primary.main', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100%' }}>
                      {record.route.routeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: '"Roboto", "Arial", sans-serif', fontSize: '12px' }}>
                      Fare: Rs. {record.route.routeCost} / month
                    </Typography>

                    <Divider sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: 'text.secondary', fontSize: '12px' }}>
                        <strong>Student:</strong> {record.student.user.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: 'text.secondary', fontSize: '12px' }}>
                        <strong>Vehicle:</strong> {record.vehicle.vehicleNo}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: '"Roboto", "Arial", sans-serif', color: 'text.secondary', fontSize: '12px' }}>
                        <strong>Driver:</strong> {record.vehicle.driverName} ({record.vehicle.driverPhone})
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5, borderColor: "divider", opacity: 0.6 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        onClick={() => handleCancelAllocation(record._id)}
                        disabled={cancelLoadingId === record._id}
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: "12px", 
                          textTransform: "none", 
                          fontFamily: '"Roboto", "Arial", sans-serif', 
                          height: 30, 
                          borderRadius: "6px", 
                          minWidth: 70, 
                          borderWidth: "1px",
                          "&:hover": {
                            borderWidth: "1px",
                            bgcolor: "rgba(239, 68, 68, 0.04)"
                          }
                        }}
                      >
                        {cancelLoadingId === record._id ? <CircularProgress size={14} color="inherit" /> : 'Cancel'}
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};