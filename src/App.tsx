import { useEffect, useState } from "react";

type ServiceRequest = {
id: string;
request_number: string;
title: string;
location: string;
category: string;
priority: string;
status: string;
};

export default function App() {
const [requests, setRequests] = useState<ServiceRequest[]>([]);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [location, setLocation] = useState("");
const [category, setCategory] = useState("Internet");
const [message, setMessage] = useState("");

async function loadRequests() {
const response = await fetch("/api/requests");
const result = await response.json();
setRequests(result.data ?? []);
}

useEffect(() => {
loadRequests();
}, []);

async function submitRequest(event: React.FormEvent) {
event.preventDefault();
setMessage("");

const response = await fetch("/api/requests", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
title,
description,
location,
category,
}),
});

const result = await response.json();

if (!response.ok) {
setMessage(result.error ?? "Laporan gagal dibuat.");
return;
}

setMessage(`Laporan berhasil dibuat: ${result.requestNumber}`);
setTitle("");
setDescription("");
setLocation("");
await loadRequests();
}

return (
<main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
<h1>Campus Service Request</h1>
<p>Laporkan masalah fasilitas kampus.</p>

<form onSubmit={submitRequest}>
<p>
<label>Judul<br />
<input value={title} onChange={(e) => setTitle(e.target.value)} />
</label>
</p>

<p>
<label>Deskripsi<br />
<textarea
value={description}
onChange={(e) => setDescription(e.target.value)}
/>
</label>
</p>

<p>
<label>Lokasi<br />
<input value={location} onChange={(e) => setLocation(e.target.value)} />
</label>
</p>

<p>
<label>Kategori<br />
<select value={category} onChange={(e) => setCategory(e.target.value)}>
<option>Internet</option>
<option>AC</option>
<option>Peralatan Kelas</option>
<option>Kebersihan</option>
<option>Lainnya</option>
</select>
</label>
</p>

<button type="submit">Kirim Laporan</button>
</form>

{message && <p>{message}</p>}

<hr />

<h2>Daftar Laporan</h2>

{requests.length === 0 ? (
<p>Belum ada laporan.</p>
) : (
<table border={1} cellPadding={8}>
<thead>
<tr>
<th>Nomor</th>
<th>Judul</th>
<th>Lokasi</th>
<th>Status</th>
</tr>
</thead>
<tbody>
{requests.map((item) => (
<tr key={item.id}>
<td>{item.request_number}</td>
<td>{item.title}</td>
<td>{item.location}</td>
<td>{item.status}</td>
</tr>
))}
</tbody>
</table>
)}
</main>
);
}