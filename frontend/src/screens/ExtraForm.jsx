import React, { useState } from "react";

const initialState = {
    name: "",
    email: "",
    birthdate: "",
    password: "",
    address: "",
    phone: "",
};

export default function ExtraForm() {
    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Hello ${form.name || "user"}`);
        setForm(initialState);
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex justify-center items-center">
            <form
                className="bg-zinc-800 p-8 rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-md"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                <h2 className="text-white text-center mb-4 font-semibold tracking-wide text-2xl">
                    Register
                </h2>
                <label className="text-zinc-200 text-base flex flex-col gap-1">
                    Name
                    <input
                        className="p-3 rounded-md border border-zinc-700 bg-zinc-900 text-white text-base outline-none mt-1"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className="text-zinc-200 text-base flex flex-col gap-1">
                    Email
                    <input
                        className="p-3 rounded-md border border-zinc-700 bg-zinc-900 text-white text-base outline-none mt-1"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className="text-zinc-200 text-base flex flex-col gap-1">
                    Birthdate
                    <input
                        className="p-3 rounded-md border border-zinc-700 bg-zinc-900 text-white text-base outline-none mt-1"
                        type="date"
                        name="birthdate"
                        value={form.birthdate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className="text-zinc-200 text-base flex flex-col gap-1">
                    Password
                    <input
                        className="p-3 rounded-md border border-zinc-700 bg-zinc-900 text-white text-base outline-none mt-1"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className="text-zinc-200 text-base flex flex-col gap-1">
                    Address
                    <input
                        className="p-3 rounded-md border border-zinc-700 bg-zinc-900 text-white text-base outline-none mt-1"
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label className="text-zinc-200 text-base flex flex-col gap-1">
                    Phone Number
                    <input
                        className="p-3 rounded-md border border-zinc-700 bg-zinc-900 text-white text-base outline-none mt-1"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button
                    className="p-3 rounded-md border-none bg-gradient-to-r from-indigo-500 to-fuchsia-800 text-white font-semibold text-lg cursor-pointer mt-4 transition-colors"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}