import React from 'react';
import { Lock, Eye, Shield, Database, Cookie, UserCheck } from 'lucide-react';
import './FooterPages.css';

const Privacy = () => {
    return (
        <div className="footer-page">
            <div className="container">
                <div className="page-hero">
                    <h1 className="page-title">🔒 Privacy Policy</h1>
                    <p className="page-subtitle">
                        Kebijakan Privasi DramaboxWeb - Terakhir diperbarui: Januari 2026
                    </p>
                </div>

                <div className="content-section">
                    <div className="info-card">
                        <Lock size={32} className="card-icon" />
                        <h2>Komitmen Privasi Kami</h2>
                        <p>
                            Di DramaboxWeb, kami sangat menghargai privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami
                            mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
                        </p>
                    </div>

                    <div className="info-card">
                        <Database size={32} className="card-icon" />
                        <h2>Informasi yang Kami Kumpulkan</h2>
                        <h3>Informasi yang Anda Berikan</h3>
                        <ul className="privacy-list">
                            <li>Alamat email (jika mendaftar akun)</li>
                            <li>Preferensi pengguna dan pengaturan</li>
                            <li>Daftar drama favorit dan riwayat tontonan</li>
                        </ul>

                        <h3>Informasi yang Dikumpulkan Otomatis</h3>
                        <ul className="privacy-list">
                            <li>Alamat IP dan informasi perangkat</li>
                            <li>Browser dan sistem operasi</li>
                            <li>Halaman yang dikunjungi dan waktu akses</li>
                            <li>Data analytics untuk meningkatkan layanan</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <Eye size={32} className="card-icon" />
                        <h2>Bagaimana Kami Menggunakan Informasi Anda</h2>
                        <ul className="privacy-list">
                            <li><strong>Penyediaan Layanan:</strong> Untuk memberikan dan memelihara layanan streaming kami</li>
                            <li><strong>Personalisasi:</strong> Untuk merekomendasikan konten yang sesuai dengan preferensi Anda</li>
                            <li><strong>Komunikasi:</strong> Untuk mengirim update, notifikasi, dan informasi penting</li>
                            <li><strong>Keamanan:</strong> Untuk melindungi platform dari penyalahgunaan dan aktivitas mencurigakan</li>
                            <li><strong>Analytics:</strong> Untuk memahami bagaimana pengguna berinteraksi dengan platform kami</li>
                            <li><strong>Peningkatan Layanan:</strong> Untuk mengembangkan fitur baru dan meningkatkan pengalaman pengguna</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <Cookie size={32} className="card-icon" />
                        <h2>Cookies dan Teknologi Pelacakan</h2>
                        <p>
                            Kami menggunakan cookies dan teknologi serupa untuk:
                        </p>
                        <ul className="privacy-list">
                            <li>Menyimpan preferensi dan pengaturan Anda</li>
                            <li>Menganalisis penggunaan situs web</li>
                            <li>Menyediakan konten yang dipersonalisasi</li>
                            <li>Meningkatkan keamanan platform</li>
                        </ul>
                        <p className="note">
                            Anda dapat mengatur browser Anda untuk menolak cookies, namun beberapa fitur mungkin tidak berfungsi dengan baik.
                        </p>
                    </div>

                    <div className="info-card">
                        <Shield size={32} className="card-icon" />
                        <h2>Keamanan Data</h2>
                        <p>
                            Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi informasi
                            pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah:
                        </p>
                        <ul className="privacy-list">
                            <li>Enkripsi SSL/TLS untuk transmisi data</li>
                            <li>Penyimpanan data yang aman dengan enkripsi</li>
                            <li>Akses terbatas ke informasi pribadi</li>
                            <li>Monitoring keamanan secara berkala</li>
                            <li>Backup data reguler</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <UserCheck size={32} className="card-icon" />
                        <h2>Hak Anda</h2>
                        <p>Anda memiliki hak untuk:</p>
                        <ul className="privacy-list">
                            <li><strong>Akses:</strong> Meminta salinan data pribadi Anda</li>
                            <li><strong>Koreksi:</strong> Memperbarui atau memperbaiki informasi yang tidak akurat</li>
                            <li><strong>Penghapusan:</strong> Meminta penghapusan data pribadi Anda</li>
                            <li><strong>Portabilitas:</strong> Menerima data Anda dalam format yang dapat dibaca mesin</li>
                            <li><strong>Keberatan:</strong> Menolak pemrosesan data pribadi Anda</li>
                            <li><strong>Pembatasan:</strong> Membatasi cara kami menggunakan data Anda</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h2>Berbagi Informasi dengan Pihak Ketiga</h2>
                        <p>
                            Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya berbagi
                            informasi dalam situasi berikut:
                        </p>
                        <ul className="privacy-list">
                            <li>Dengan penyedia layanan yang membantu operasional platform kami</li>
                            <li>Untuk mematuhi kewajiban hukum atau proses hukum</li>
                            <li>Untuk melindungi hak, properti, atau keamanan kami dan pengguna lain</li>
                            <li>Dengan persetujuan eksplisit Anda</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h2>Privasi Anak-anak</h2>
                        <p>
                            Layanan kami tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak dengan sengaja
                            mengumpulkan informasi pribadi dari anak-anak. Jika Anda yakin kami memiliki informasi dari anak
                            di bawah 13 tahun, silakan hubungi kami.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>Perubahan Kebijakan Privasi</h2>
                        <p>
                            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang
                            perubahan signifikan dengan memposting kebijakan baru di halaman ini dan memperbarui tanggal
                            "Terakhir diperbarui" di bagian atas.
                        </p>
                    </div>

                    <div className="contact-box">
                        <h3>📧 Hubungi Kami</h3>
                        <p>
                            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda,
                            silakan hubungi kami di:
                        </p>
                        <p><strong>Email:</strong> privacy@dramaboxweb.com</p>
                        <p><strong>Response Time:</strong> 48-72 jam</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
