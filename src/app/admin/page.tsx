"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  CarMascot,
  CloudDoodle,
  SunDoodle,
  StarDoodle,
  BlobDoodle,
  SquiggleDoodle,
  ArrowDoodle,
  PinDoodle,
  CoinDoodle,
  HeartDoodle,
  SkateDoodle,
  ChatDoodle,
  PaperPlane,
  FriendMascot,
} from "@/components/doodles";
import {
  AadhaarDoodle,
  AutoDoodle,
  BankDoodle,
  BikeDoodle,
  CabDoodle,
  Cloud,
  LicenseDoodle,
  RCDoodle,
  Star,
  Sun,
  UpiDoodle,
} from "@/components/driver/VehicleDoodles";

type Tab = "students" | "drivers";
type ReviewStatus = "approved" | "pending" | "rejected";

// High-fidelity Mock Data Fallbacks
const MOCK_STUDENTS = [
  {
    id: "mock_student_1",
    name: "Riya Sharma",
    email: "riya.sharma@campus.edu",
    college_id: "20230891",
    coins_balance: 320,
    ride_streak: 5,
    emergency_contact: "Father: +91 98765 43210",
  },
  {
    id: "mock_student_2",
    name: "Rohan Verma",
    email: "rohan.v@campus.edu",
    college_id: "20240124",
    coins_balance: 110,
    ride_streak: 2,
    emergency_contact: "Mother: +91 99887 76655",
  },
  {
    id: "mock_student_3",
    name: "Ananya Rao",
    email: "ananya.rao@campus.edu",
    college_id: "20220459",
    coins_balance: 580,
    ride_streak: 11,
    emergency_contact: "Brother: +91 91234 56789",
  },
  {
    id: "mock_student_4",
    name: "Kabir Singh",
    email: "kabir.s@campus.edu",
    college_id: "20230231",
    coins_balance: 45,
    ride_streak: 0,
    emergency_contact: "Guardian: +91 93456 78901",
  },
];

const MOCK_DRIVERS = [
  {
    user_id: "mock_driver_1",
    email: "vikram.singh@rides.com",
    phone: "+91 87654 32109",
    rating: 4.8,
    vehicle_type: "cab",
    is_approved: false,
    status: "pending",
    created_at: "2026-05-18T10:30:00Z",
  },
  {
    user_id: "mock_driver_2",
    email: "priya.nair@rides.com",
    phone: "+91 76543 21098",
    rating: 4.9,
    vehicle_type: "auto",
    is_approved: true,
    status: "approved",
    created_at: "2026-05-15T08:15:00Z",
  },
  {
    user_id: "mock_driver_3",
    email: "dev.patel@rides.com",
    phone: "+91 95432 10987",
    rating: 4.3,
    vehicle_type: "bike",
    is_approved: false,
    status: "rejected: Document verification failed. Aadhaar image is blurry.",
    created_at: "2026-05-19T14:45:00Z",
  },
];

const MOCK_VEHICLES: Record<string, any> = {
  mock_driver_1: {
    vehicle_type: "cab",
    vehicle_model: "Maruti Suzuki Dzire",
    vehicle_number: "TS 09 AB 1234",
  },
  mock_driver_2: {
    vehicle_type: "auto",
    vehicle_model: "Bajaj Compact RE",
    vehicle_number: "AP 39 TT 5678",
  },
  mock_driver_3: {
    vehicle_type: "bike",
    vehicle_model: "Honda Activa 6G",
    vehicle_number: "TS 07 FG 9012",
  },
};

const MOCK_PAYOUTS: Record<string, any> = {
  mock_driver_1: {
    accountHolderName: "Vikram Singh",
    accountNumber: "10928374656",
    ifscCode: "SBIN0004561",
    upiId: "vikram@oksbi",
  },
  mock_driver_2: {
    accountHolderName: "Priya Nair",
    accountNumber: "91827364528",
    ifscCode: "HDFC0001245",
    upiId: "priya@okhdfc",
  },
  mock_driver_3: {
    accountHolderName: "Dev Patel",
    accountNumber: "56748392019",
    ifscCode: "ICIC0000234",
    upiId: "devpatel@okicici",
  },
};

export default function AdminDashboardPage() {
  const supabase = useMemo(() => createClient(), []);

  const [activeTab, setActiveTab] = useState<Tab>("students");
  const [students, setStudents] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSandbox, setIsSandbox] = useState(false);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [driverFilter, setDriverFilter] = useState<string>("all");

  // Driver details modal
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [selectedDriverVehicle, setSelectedDriverVehicle] = useState<any | null>(null);
  const [selectedDriverDocs, setSelectedDriverDocs] = useState<any[]>([]);
  const [selectedDriverPayout, setSelectedDriverPayout] = useState<any | null>(null);
  const [docBlobUrls, setDocBlobUrls] = useState<Record<string, string>>({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Rejection Form
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  // Coin Award Amount State per student ID
  const [awardAmount, setAwardAmount] = useState<Record<string, string>>({});

  // Load live data from Supabase
  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: liveStudents, error: studentErr } = await supabase
        .from("students")
        .select("*");
      
      const { data: liveDrivers, error: driverErr } = await supabase
        .from("drivers")
        .select("*");

      if (studentErr || driverErr || (!liveStudents?.length && !liveDrivers?.length)) {
        // Fallback to sandbox mock data
        setStudents(MOCK_STUDENTS);
        setDrivers(MOCK_DRIVERS);
        setIsSandbox(true);
      } else {
        setStudents(liveStudents || []);
        setDrivers(liveDrivers || []);
        setIsSandbox(false);
      }
    } catch (err) {
      console.error(err);
      setStudents(MOCK_STUDENTS);
      setDrivers(MOCK_DRIVERS);
      setIsSandbox(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch driver detail files/vehicle details
  const loadDriverDetails = async (driver: any) => {
    setLoadingDetails(true);
    setSelectedDriver(driver);
    setSelectedDriverVehicle(null);
    setSelectedDriverDocs([]);
    setSelectedDriverPayout(null);
    setShowRejectForm(false);
    setRejectReason("");

    // Revoke old object URLs
    Object.values(docBlobUrls).forEach((url) => URL.revokeObjectURL(url));
    setDocBlobUrls({});

    if (driver.user_id.startsWith("mock_")) {
      // Load mock details
      setTimeout(() => {
        setSelectedDriverVehicle(MOCK_VEHICLES[driver.user_id] || null);
        setSelectedDriverPayout(MOCK_PAYOUTS[driver.user_id] || null);
        setSelectedDriverDocs([
          { doc_type: "aadhaar", status: driver.status === "approved" ? "approved" : driver.status.startsWith("rejected") ? "rejected" : "pending", file_path: "mock_aadhaar.png" },
          { doc_type: "license", status: driver.status === "approved" ? "approved" : driver.status.startsWith("rejected") ? "rejected" : "pending", file_path: "mock_license.png" },
          { doc_type: "rc", status: driver.status === "approved" ? "approved" : driver.status.startsWith("rejected") ? "rejected" : "pending", file_path: "mock_rc.png" },
          { doc_type: "upi_qr", status: driver.status === "approved" ? "approved" : driver.status.startsWith("rejected") ? "rejected" : "pending", file_path: "mock_qr.png" },
        ]);
        setLoadingDetails(false);
      }, 500);
      return;
    }

    try {
      // 1. Fetch vehicle info
      const { data: vehicle } = await supabase
        .from("driver_vehicles")
        .select("*")
        .eq("driver_id", driver.user_id)
        .maybeSingle();
      setSelectedDriverVehicle(vehicle);

      // 2. Fetch documents metadata
      const { data: docs } = await supabase
        .from("driver_documents")
        .select("*")
        .eq("driver_id", driver.user_id);

      if (docs) {
        setSelectedDriverDocs(docs);

        // Fetch bank details directly from storage
        try {
          const { data: fileBlob } = await supabase.storage
            .from("driver-documents")
            .download(`${driver.user_id}/payout_details.png`);

          if (fileBlob) {
            const text = await fileBlob.text();
            const json = JSON.parse(text);
            setSelectedDriverPayout(json);
          }
        } catch (err) {
          console.error("Failed to load payout details from storage", err);
        }

        // Fetch blobs for images
        const blobUrls: Record<string, string> = {};
        for (const doc of docs) {
          try {
            const { data: fileBlob } = await supabase.storage
              .from("driver-documents")
              .download(doc.file_path);
            if (fileBlob) {
              const objectUrl = URL.createObjectURL(fileBlob);
              blobUrls[doc.doc_type] = objectUrl;
            }
          } catch (err) {
            console.error(`Failed to load ${doc.doc_type} file`, err);
          }
        }

        // Fetch UPI QR directly from storage
        try {
          const { data: storageFiles } = await supabase.storage
            .from("driver-documents")
            .list(driver.user_id);

          const qrFile = storageFiles?.find((f) => f.name.startsWith("upi_qr"));
          if (qrFile) {
            const { data: qrBlob } = await supabase.storage
              .from("driver-documents")
              .download(`${driver.user_id}/${qrFile.name}`);
            if (qrBlob) {
              const objectUrl = URL.createObjectURL(qrBlob);
              blobUrls["upi_qr"] = objectUrl;
            }
          }
        } catch (err) {
          console.error("Failed to load UPI QR from storage", err);
        }

        setDocBlobUrls(blobUrls);
      }
    } catch (err) {
      console.error("Error loading live driver details", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Student Actions
  const handleAwardCoins = async (studentId: string) => {
    const amtStr = awardAmount[studentId] || "";
    const amount = parseInt(amtStr, 10);
    if (isNaN(amount) || amount === 0) return;

    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const newBalance = Number(student.coins_balance || 0) + amount;

    // Local State update
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, coins_balance: newBalance } : s))
    );
    setAwardAmount((prev) => ({ ...prev, [studentId]: "" }));

    if (studentId.startsWith("mock_")) return;

    try {
      await supabase
        .from("students")
        .update({ coins_balance: newBalance })
        .eq("id", studentId);
    } catch (err) {
      console.error("Failed to update coins live", err);
    }
  };

  const handleAdjustStreak = async (studentId: string, amount: number) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const newStreak = Math.max(0, Number(student.ride_streak || 0) + amount);

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ride_streak: newStreak } : s))
    );

    if (studentId.startsWith("mock_")) return;

    try {
      await supabase
        .from("students")
        .update({ ride_streak: newStreak })
        .eq("id", studentId);
    } catch (err) {
      console.error("Failed to update streak live", err);
    }
  };

  // Driver Approvals
  const handleApproveDriver = async (driverId: string) => {
    // Local Update
    setDrivers((prev) =>
      prev.map((d) => (d.user_id === driverId ? { ...d, is_approved: true, status: "approved" } : d))
    );
    if (selectedDriver) {
      setSelectedDriver((prev: any) =>
        prev ? { ...prev, is_approved: true, status: "approved" } : null
      );
      setSelectedDriverDocs((prev) => prev.map((d) => ({ ...d, status: "approved" })));
    }

    if (driverId.startsWith("mock_")) return;

    try {
      // 1. Update status
      await supabase
        .from("drivers")
        .update({ is_approved: true, status: "approved" })
        .eq("user_id", driverId);

      // 2. Approve all documents
      await supabase
        .from("driver_documents")
        .update({ status: "approved" })
        .eq("driver_id", driverId);
    } catch (err) {
      console.error("Failed to approve driver live", err);
    }
  };

  const handleRejectDriver = async (driverId: string) => {
    if (!rejectReason.trim()) return;

    // Local Update
    const rejectionText = `rejected: ${rejectReason}`;
    setDrivers((prev) =>
      prev.map((d) => (d.user_id === driverId ? { ...d, is_approved: false, status: rejectionText } : d))
    );
    if (selectedDriver) {
      setSelectedDriver((prev: any) =>
        prev ? { ...prev, is_approved: false, status: rejectionText } : null
      );
      setSelectedDriverDocs((prev) => prev.map((d) => ({ ...d, status: "rejected" })));
    }
    setShowRejectForm(false);
    setRejectReason("");

    if (driverId.startsWith("mock_")) return;

    try {
      // 1. Update status
      await supabase
        .from("drivers")
        .update({ is_approved: false, status: rejectionText })
        .eq("user_id", driverId);

      // 2. Reject all documents
      await supabase
        .from("driver_documents")
        .update({ status: "rejected" })
        .eq("driver_id", driverId);
    } catch (err) {
      console.error("Failed to reject driver live", err);
    }
  };

  // Filtered lists
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchText = `${s.name} ${s.email} ${s.college_id}`.toLowerCase();
      return matchText.includes(studentSearch.toLowerCase());
    });
  }, [students, studentSearch]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchText = `${d.email} ${d.phone}`.toLowerCase();
      const matchesSearch = matchText.includes(driverSearch.toLowerCase());
      
      const parsedStatus = d.status.startsWith("rejected") ? "rejected" : d.status;
      const matchesFilter = driverFilter === "all" || parsedStatus === driverFilter;

      return matchesSearch && matchesFilter;
    });
  }, [drivers, driverSearch, driverFilter]);

  // Stats Calculations
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const activeDrivers = drivers.filter((d) => d.status === "approved" || d.is_approved).length;
    const pendingApprovals = drivers.filter((d) => d.status === "pending").length;
    const rejectedDrivers = drivers.filter((d) => d.status.startsWith("rejected")).length;

    return { totalStudents, activeDrivers, pendingApprovals, rejectedDrivers };
  }, [students, drivers]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream font-hand text-ink pb-20">
      {/* Decorative Floating Doodles */}
      <div className="pointer-events-none absolute top-6 left-[4%] w-20 float-a opacity-30 sm:opacity-100">
        <Cloud />
      </div>
      <div className="pointer-events-none absolute top-14 right-[6%] w-24 float-b opacity-30 sm:opacity-100">
        <Sun />
      </div>
      <div className="pointer-events-none absolute bottom-20 left-[2%] w-14 float-c opacity-20 sm:opacity-90">
        <Star color="#9B5DE5" />
      </div>
      <div className="pointer-events-none absolute bottom-12 right-[4%] w-12 float-a opacity-20 sm:opacity-90">
        <Star color="#FF5A36" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 space-y-10">
        {/* Sandbox Notice Banner */}
        {isSandbox && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between border-[2.5px] border-ink bg-sun/40 p-4 rounded-2xl"
            style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 grid place-items-center rounded-full bg-sun border-[2px] border-ink font-marker">i</span>
              <p className="font-hand text-base">
                <span className="font-bold">Sandbox Mode:</span> Showing local mock data because live Supabase tables are empty or loading was bypassed.
              </p>
            </div>
            <button
              onClick={loadData}
              className="sketch-btn sketch-btn--small !py-1"
            >
              Refresh
            </button>
          </motion.div>
        )}

        {/* Dashboard Title */}
        <header className="flex flex-wrap items-center justify-between gap-6 border-b-[3px] border-ink pb-8">
          <div>
            <p className="font-scribble text-2xl text-tomato">~ admin control center ~</p>
            <h1 className="font-marker text-4xl sm:text-5xl mt-1">
              Campus Rides <span className="scribble">Console</span>
            </h1>
            <p className="font-hand text-lg text-ink/75 max-w-2xl mt-2">
              Oversee campus logistics, distribute token rewards, and verify driver credentials.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="sketch-btn">
              Go to Home
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Students", value: stats.totalStudents, color: "#FFD23F", desc: "Registered riders" },
            { label: "Active Drivers", value: stats.activeDrivers, color: "#7BC950", desc: "Verified & ready" },
            { label: "Pending Approvals", value: stats.pendingApprovals, color: "#5BC0EB", desc: "Awaiting review", highlight: stats.pendingApprovals > 0 },
            { label: "Needs Correction", value: stats.rejectedDrivers, color: "#FF5A36", desc: "Rejected applications" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12, rotate: idx % 2 ? -0.8 : 0.8 }}
              animate={{ opacity: 1, y: 0, rotate: idx % 2 ? -0.4 : 0.4 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="sketch-card !p-5 relative overflow-hidden"
              style={{
                background: stat.highlight ? "#FFB4A2" : "#fff",
                boxShadow: "5px 5px 0 #1B1B1F",
              }}
            >
              <div className="absolute right-3 top-3 opacity-25 w-12">
                {idx === 0 && <FriendMascot className="w-full h-auto" />}
                {idx === 1 && <CarMascot className="w-full h-auto" />}
                {idx === 2 && <PaperPlane className="w-full h-auto" />}
                {idx === 3 && <ChatDoodle className="w-full h-auto" />}
              </div>
              <p className="font-scribble text-lg text-ink/65 uppercase tracking-wide">{stat.label}</p>
              <h3 className="font-marker text-4xl mt-1">{stat.value}</h3>
              <p className="font-hand text-sm text-ink/75 mt-2">{stat.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Tab Controls */}
        <div className="flex gap-4 border-b-[2px] border-ink pb-1">
          {[
            { id: "students", label: "Students Registry", color: "#FFD23F" },
            { id: "drivers", label: "Drivers Approval Board", color: "#7BC950" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className="relative pb-3 px-2 font-marker text-xl sm:text-2xl focus:outline-none"
              >
                <span className={active ? "text-tomato" : "text-ink/60"}>{tab.label}</span>
                {active && (
                  <motion.div
                    layoutId="admin-active-tab"
                    className="absolute bottom-0 left-0 right-0 h-[4px] bg-tomato rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "students" ? (
            <motion.div
              key="students-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3 max-w-md sketch-card !p-2 bg-white">
                <span className="pl-3 font-marker text-lg text-ink/40">🔍</span>
                <input
                  type="text"
                  placeholder="Search students by name, email, ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pr-3 py-2 bg-transparent focus:outline-none font-hand text-lg"
                />
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto border-[2.5px] border-ink rounded-3xl bg-white shadow-[6px_6px_0_#1b1b1f]">
                {filteredStudents.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <p className="font-scribble text-2xl text-tomato">~ no matches found ~</p>
                    <p className="font-hand text-lg text-ink/60">Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b-[2.5px] border-ink bg-cream/70 font-marker text-lg">
                        <th className="p-4">Student Details</th>
                        <th className="p-4">College ID</th>
                        <th className="p-4">Rides Streak</th>
                        <th className="p-4">Coins Balance</th>
                        <th className="p-4 text-center">Actions / Adjustments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-ink/10 hover:bg-cream/20 font-hand text-base transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-bold text-lg">{student.name}</div>
                            <div className="text-sm text-ink/65">{student.email}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-plum">{student.college_id}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{student.ride_streak} 🔥</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleAdjustStreak(student.id, -1)}
                                  className="w-6 h-6 grid place-items-center border border-ink rounded bg-white hover:bg-cream text-sm"
                                  title="Deduct streak"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => handleAdjustStreak(student.id, 1)}
                                  className="w-6 h-6 grid place-items-center border border-ink rounded bg-white hover:bg-cream text-sm"
                                  title="Add streak"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-marker text-lg text-leaf">{student.coins_balance} 💰</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <input
                                type="number"
                                placeholder="Coins"
                                value={awardAmount[student.id] || ""}
                                onChange={(e) =>
                                  setAwardAmount((prev) => ({ ...prev, [student.id]: e.target.value }))
                                }
                                className="w-20 px-2 py-1 border-[2px] border-ink rounded-lg focus:outline-none text-center bg-cream/35 text-base"
                              />
                              <button
                                onClick={() => handleAwardCoins(student.id)}
                                className="sketch-btn sketch-btn--small sketch-btn--sun !px-3 !py-1 font-bold text-sm"
                              >
                                Adjust Coins
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="drivers-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Search & Status Filters */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:max-w-md sketch-card !p-2 bg-white">
                  <span className="pl-3 font-marker text-lg text-ink/40">🔍</span>
                  <input
                    type="text"
                    placeholder="Search drivers by email..."
                    value={driverSearch}
                    onChange={(e) => setDriverSearch(e.target.value)}
                    className="w-full pr-3 py-2 bg-transparent focus:outline-none font-hand text-lg"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "All", value: "all" },
                    { label: "Pending", value: "pending" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setDriverFilter(filter.value)}
                      className={`px-4 py-2 border-[2px] border-ink rounded-full font-hand text-base shadow-[2px_2px_0_#1b1b1f] hover:translate-y-[-1px] transition-transform ${
                        driverFilter === filter.value
                          ? "bg-sun text-ink"
                          : "bg-white text-ink/70"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drivers Card Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrivers.length === 0 ? (
                  <div className="col-span-full sketch-card !p-12 text-center space-y-3 bg-white">
                    <p className="font-scribble text-2xl text-tomato">~ no driver applications match ~</p>
                    <p className="font-hand text-lg text-ink/60">Change the filter settings or query text.</p>
                  </div>
                ) : (
                  filteredDrivers.map((driver) => {
                    const isApproved = driver.is_approved || driver.status === "approved";
                    const isRejected = driver.status.startsWith("rejected");
                    const cardBg = isApproved ? "bg-white" : isRejected ? "bg-white" : "bg-sun/10";
                    const statusColor = isApproved ? "#7BC950" : isRejected ? "#FF5A36" : "#FFD23F";
                    const statusText = isApproved ? "Approved" : isRejected ? "Rejected" : "Pending";

                    return (
                      <motion.div
                        key={driver.user_id}
                        layoutId={`driver-card-${driver.user_id}`}
                        onClick={() => loadDriverDetails(driver)}
                        className={`sketch-card !p-5 relative cursor-pointer hover:shadow-[7px_7px_0_#1b1b1f] active:scale-[0.99] transition-all bg-white`}
                        style={{ boxShadow: "4px 4px 0 #1B1B1F" }}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className="px-3 py-1 border-[2px] border-ink rounded-full font-hand text-sm font-bold"
                            style={{ background: statusColor }}
                          >
                            {statusText}
                          </span>
                          <span className="capitalize px-2 py-1 border border-ink/20 rounded font-mono text-sm">
                            {driver.vehicle_type || "No vehicle"}
                          </span>
                        </div>
                        <h4 className="font-marker text-xl mt-4 break-words">{driver.email}</h4>
                        <p className="font-hand text-base text-ink/75 mt-1">{driver.phone || "No phone linked"}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                          <div className="flex items-center gap-1 text-tomato font-bold">
                            ★ <span className="text-ink">{driver.rating ?? "5.0"}</span>
                          </div>
                          <span className="font-scribble text-base text-plum">review details →</span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Driver Detail Review Drawer (Modal overlays) */}
        <AnimatePresence>
          {selectedDriver && (
            <motion.div
              className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDriver(null)}
            >
              {/* Drawer Content */}
              <motion.div
                className="relative w-full max-w-2xl bg-cream border-l-[3px] border-ink h-full shadow-2xl p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedDriver(null)}
                    className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full border-[2.5px] border-ink bg-white font-marker hover:bg-cream"
                  >
                    ✕
                  </button>

                  <p className="font-scribble text-2xl text-tomato">~ verify documents & details ~</p>
                  <h2 className="font-marker text-3xl mt-1 leading-tight break-words pr-8">
                    {selectedDriver.email}
                  </h2>
                  <p className="font-hand text-base text-ink/70">Phone: {selectedDriver.phone || "Not provided"}</p>

                  {loadingDetails ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-10 h-10 border-4 border-tomato border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="font-hand text-lg text-ink/70">Loading onboarding data...</p>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-6">
                      {/* Vehicle Details */}
                      <div className="sketch-card !p-5 bg-white">
                        <p className="font-scribble text-xl text-leaf">~ vehicle credentials ~</p>
                        <h4 className="font-marker text-xl mt-1">Vehicle Setup</h4>
                        {selectedDriverVehicle ? (
                          <div className="mt-3 grid grid-cols-2 gap-4 font-hand text-base">
                            <div>
                              <span className="text-ink/60 block">Vehicle Model</span>
                              <span className="font-bold">{selectedDriverVehicle.vehicle_model}</span>
                            </div>
                            <div>
                              <span className="text-ink/60 block">Plate Number</span>
                              <span className="font-bold uppercase font-mono">{selectedDriverVehicle.vehicle_number}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-ink/60 block">Type Classification</span>
                              <span className="font-bold uppercase text-plum">{selectedDriverVehicle.vehicle_type}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-tomato font-hand text-base">No vehicle registered by driver yet.</p>
                        )}
                      </div>

                      {/* Documents Grid */}
                      <div className="space-y-4">
                        <p className="font-scribble text-xl text-plum">~ verification uploads ~</p>
                        <h4 className="font-marker text-xl">Onboarding Documents</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          {selectedDriverDocs
                            .filter((doc) => doc.doc_type !== "payout_details" && doc.doc_type !== "upi_qr")
                            .map((doc) => (
                              <div key={doc.doc_type} className="sketch-card !p-4 bg-white flex flex-col justify-between h-full">
                                <div>
                                  <span className="font-marker text-lg uppercase text-ink block">
                                    {doc.doc_type === "aadhaar" ? "Aadhaar Card" : doc.doc_type === "license" ? "Driver License" : "Vehicle RC"}
                                  </span>
                                  <span
                                    className={`inline-block mt-2 px-2 py-0.5 rounded-full border border-ink text-xs font-bold ${
                                      doc.status === "approved"
                                        ? "bg-leaf/30 text-ink"
                                        : doc.status === "rejected"
                                        ? "bg-tomato/30 text-ink"
                                        : "bg-sun/30 text-ink"
                                    }`}
                                  >
                                    {doc.status}
                                  </span>
                                </div>
                                <div className="mt-4">
                                  {docBlobUrls[doc.doc_type] ? (
                                    <div className="space-y-2">
                                      <div className="border border-ink/20 rounded-lg overflow-hidden aspect-video bg-cream relative">
                                        <img
                                          src={docBlobUrls[doc.doc_type]}
                                          alt={doc.doc_type}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <a
                                        href={docBlobUrls[doc.doc_type]}
                                        download={`${selectedDriver.email}_${doc.doc_type}`}
                                        className="block text-center font-hand text-sm underline text-tomato"
                                      >
                                        Download Image
                                      </a>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-ink/50 bg-cream/40 p-2 rounded text-center">
                                      {selectedDriver.user_id.startsWith("mock_") ? "Mock Image Loaded" : "No image preview available"}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Payout Details */}
                      <div className="sketch-card !p-5 bg-white">
                        <p className="font-scribble text-xl text-tomato">~ payout details ~</p>
                        <h4 className="font-marker text-xl mt-1">Bank Account & UPI</h4>
                        {selectedDriverPayout ? (
                          <div className="mt-3 grid sm:grid-cols-2 gap-4 font-hand text-base">
                            <div>
                              <span className="text-ink/60 block">Account Holder</span>
                              <span className="font-bold">{selectedDriverPayout.accountHolderName}</span>
                            </div>
                            <div>
                              <span className="text-ink/60 block">Bank Account Number</span>
                              <span className="font-bold font-mono">{selectedDriverPayout.accountNumber}</span>
                            </div>
                            <div>
                              <span className="text-ink/60 block">IFSC Code</span>
                              <span className="font-bold uppercase font-mono">{selectedDriverPayout.ifscCode}</span>
                            </div>
                            <div>
                              <span className="text-ink/60 block">UPI Identifier</span>
                              <span className="font-bold text-plum break-all">{selectedDriverPayout.upiId}</span>
                            </div>

                            {/* UPI QR Display */}
                            <div className="sm:col-span-2 border-t border-ink/10 pt-3">
                              <span className="text-ink/60 block mb-2">UPI QR Code</span>
                              {docBlobUrls["upi_qr"] ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-24 h-24 border border-ink/20 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                                    <img
                                      src={docBlobUrls["upi_qr"]}
                                      alt="UPI QR Code"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <a
                                    href={docBlobUrls["upi_qr"]}
                                    download={`${selectedDriver.email}_upi_qr`}
                                    className="font-hand text-sm underline text-tomato"
                                  >
                                    Download QR
                                  </a>
                                </div>
                              ) : (
                                <div className="text-sm text-ink/50 bg-cream/40 p-2 rounded text-center">
                                  No QR Image preview available.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-tomato font-hand text-base">No bank details uploaded by driver.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Approve/Reject Controls */}
                {!loadingDetails && selectedDriver && (
                  <div className="border-t-[3.5px] border-ink pt-6 bg-cream">
                    {selectedDriver.status === "approved" || selectedDriver.is_approved ? (
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="font-hand text-base text-leaf font-bold">
                          ✓ Driver is active and approved.
                        </div>
                        <button
                          onClick={() => {
                            // Reset driver to pending
                            setDrivers((prev) =>
                              prev.map((d) => (d.user_id === selectedDriver.user_id ? { ...d, is_approved: false, status: "pending" } : d))
                            );
                            setSelectedDriver((prev: any) =>
                              prev ? { ...prev, is_approved: false, status: "pending" } : null
                            );
                          }}
                          className="sketch-btn sketch-btn--small"
                        >
                          Revert to Pending
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {showRejectForm ? (
                          <div className="space-y-3">
                            <label className="block">
                              <span className="font-hand text-base font-bold">Specify rejection reasons:</span>
                              <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="E.g. Document image blurry. Please re-upload your driver's license."
                                className="w-full mt-2 px-3 py-2 border-[2.5px] border-ink rounded-xl bg-white focus:outline-none font-hand text-base"
                                rows={3}
                              />
                            </label>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleRejectDriver(selectedDriver.user_id)}
                                className="sketch-btn sketch-btn--tomato"
                                disabled={!rejectReason.trim()}
                              >
                                Submit Rejection
                              </button>
                              <button
                                onClick={() => setShowRejectForm(false)}
                                className="sketch-btn"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-4">
                            <button
                              onClick={() => handleApproveDriver(selectedDriver.user_id)}
                              className="sketch-btn sketch-btn--sun font-bold"
                            >
                              Approve Driver & Documents
                            </button>
                            <button
                              onClick={() => setShowRejectForm(true)}
                              className="sketch-btn sketch-btn--tomato font-bold"
                            >
                              Reject Application
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
