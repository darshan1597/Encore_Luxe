import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
    const {adminData} = useSelector(state=>state.admin)
    const adminId = adminData?._id

    const [adminDetails, setAdminDetails] = useState(null);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        fetchAdmin();
        console.log(adminData)
    }, []);

    const fetchAdmin = async () => {
        try {
            const res = await axios.get(
                `${serverUrl}/api/admin/profile/${adminId}`,
                { withCredentials: true }
            );
            setAdminDetails(res.data.admin);
        } catch (err) {
            setError("Failed to load profile");
        }
    };

    const handleChangePassword = async () => {
        if (!oldPassword) {
            return setError("Old Password is required");
        }
        if (!newPassword) {
            return setError("New Password is required");
        }
        if (!confirmPassword) {
            return setError("Confirm Password is required");
        }
        if (newPassword.length < 6) {
            return setError("Password must contain 6 charaters");
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setPasswordSaving(true);
        setSuccess("");
        setError("");

        try {
            await axios.put(`${serverUrl}/api/admin/change-password/${adminId}`, { oldPassword, newPassword }, { withCredentials: true });

            setSuccess("Password changed successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err?.response?.data?.message || "Password change failed");
        }

        setPasswordSaving(false);
    };

    if (!adminDetails) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <ClipLoader size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full transition-opacity duration-1000 bg-white">
            <section className="relative flex flex-col justify-between z-10">
                <AdminNavbar />
            </section>

            <div className="p-6 max-w-2xl mx-auto mt-48 shadow-2xl mb-30 rounded-3xl bg-gray-100">
                <div className='flex gap-4 items-center mb-10'>
                    <MdKeyboardBackspace className='text-2xl cursor-pointer mt-1' onClick={()=>navigate("/admin/admin-panel")} />
                    <h3 className="text-2xl font-bold text-black">Admin Profile</h3>
                </div>

                {/* Profile Info */}
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold">Full Name</label>
                        <input type="text" className="w-full p-3 mt-1 border rounded-xl bg-white cursor-not-allowed" value={adminDetails.fullName} readonly />
                    </div>

                    <div>
                        <label className="font-semibold">Email</label>
                        <input type="text" className="w-full p-3 mt-1 border rounded-xl bg-white cursor-not-allowed" disabled value={adminDetails.email} />
                    </div>

                    <div>
                        <label className="font-semibold">Mobile</label>
                        <input type="text" className="w-full p-3 mt-1 border rounded-xl bg-white cursor-not-allowed" value={adminDetails.mobile} />
                    </div>
                </div>

                {error && <p className="text-red-500 text-center mt-3">{error}</p>}
                {success && <p className="text-green-600 text-center mt-3">{success}</p>}

                {/* Password Change */}
                <h2 className="text-2xl font-bold mt-10 mb-4">Change Password</h2>

                <div className="space-y-4">
                    <div>
                        <label className="font-semibold">Old Password</label>
                        <input type="password" className="w-full p-3 mt-1 border rounded-xl" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>

                    <div>
                        <label className="font-semibold">New Password</label>
                        <input type="password" className="w-full p-3 mt-1 border rounded-xl" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>

                    <div>
                        <label className="font-semibold">Confirm New Password</label>
                        <input type="password" className="w-full p-3 mt-1 border rounded-xl" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>

                    <button className="w-full mt-4 py-3 bg-gray-800 text-white rounded-full hover:bg-white hover:text-black border border-gray-800 transition cursor-pointer" onClick={handleChangePassword} disabled={passwordSaving} >
                        {passwordSaving ? <ClipLoader size={20} color="white" /> : "Change Password"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
