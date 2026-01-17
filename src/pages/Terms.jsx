import React from 'react';
import { FileText, CheckCircle, XCircle, AlertCircle, Scale } from 'lucide-react';
import './FooterPages.css';

const Terms = () => {
    return (
        <div className="footer-page">
            <div className="container">
                <div className="page-hero">
                    <h1 className="page-title">📜 Terms of Service</h1>
                    <p className="page-subtitle">
                        Syarat dan Ketentuan Penggunaan DramaboxWeb - Efektif sejak Januari 2026
                    </p>
                </div>

                <div className="content-section">
                    <div className="info-card">
                        <FileText size={32} className="card-icon" />
                        <h2>1. Penerimaan Syarat</h2>
                        <p>
                            Dengan mengakses dan menggunakan DramaboxWeb ("Layanan"), Anda setuju untuk terikat oleh Syarat dan
                            Ketentuan ini. Jika Anda tidak setuju dengan syarat ini, mohon untuk tidak menggunakan Layanan kami.
                        </p>
                    </div>

                    <div className="info-card">
                        <CheckCircle size={32} className="card-icon" />
                        <h2>2. Penggunaan Layanan</h2>
                        <h3>Anda Diizinkan Untuk:</h3>
                        <ul className="terms-list allowed">
                            <li>Menonton konten yang tersedia di platform</li>
                            <li>Membuat akun pengguna untuk fitur tambahan</li>
                            <li>Menyimpan drama ke daftar favorit Anda</li>
                            <li>Berbagi link ke konten dengan orang lain</li>
                            <li>Memberikan feedback dan saran</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <XCircle size={32} className="card-icon" />
                        <h2>3. Penggunaan yang Dilarang</h2>
                        <h3>Anda TIDAK Diizinkan Untuk:</h3>
                        <ul className="terms-list forbidden">
                            <li>Mengunduh, merekam, atau mendistribusikan konten tanpa izin</li>
                            <li>Menggunakan bot, scraper, atau automated tools</li>
                            <li>Mencoba mengakses sistem atau data yang tidak diotorisasi</li>
                            <li>Mengunggah malware, virus, atau kode berbahaya</li>
                            <li>Melakukan aktivitas ilegal atau melanggar hak orang lain</li>
                            <li>Menyalahgunakan atau memanipulasi sistem rating/review</li>
                            <li>Menggunakan layanan untuk tujuan komersial tanpa izin</li>
                            <li>Membuat akun palsu atau menyamar sebagai orang lain</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <Scale size={32} className="card-icon" />
                        <h2>4. Hak Kekayaan Intelektual</h2>
                        <p>
                            Semua konten di DramaboxWeb, termasuk namun tidak terbatas pada teks, grafik, logo, ikon, gambar,
                            klip audio, dan perangkat lunak, adalah properti dari DramaboxWeb atau pemberi lisensinya dan
                            dilindungi oleh undang-undang hak cipta internasional.
                        </p>
                        <p className="note">
                            DramaboxWeb adalah platform agregator. Kami tidak meng-host konten video. Semua video disediakan
                            oleh pihak ketiga dan kami hanya menyediakan link ke konten tersebut.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>5. Akun Pengguna</h2>
                        <h3>Tanggung Jawab Anda:</h3>
                        <ul className="terms-list">
                            <li>Menjaga kerahasiaan informasi akun Anda</li>
                            <li>Bertanggung jawab atas semua aktivitas di akun Anda</li>
                            <li>Memberikan informasi yang akurat dan terkini</li>
                            <li>Segera memberi tahu kami jika terjadi penggunaan tidak sah</li>
                        </ul>
                        <p>
                            Kami berhak menangguhkan atau menghentikan akun Anda jika kami mencurigai pelanggaran terhadap
                            Syarat dan Ketentuan ini.
                        </p>
                    </div>

                    <div className="info-card">
                        <AlertCircle size={32} className="card-icon" />
                        <h2>6. Disclaimer dan Batasan Tanggung Jawab</h2>
                        <div className="disclaimer-box">
                            <h3>⚠️ Disclaimer Penting</h3>
                            <p>
                                Layanan disediakan "SEBAGAIMANA ADANYA" dan "SEBAGAIMANA TERSEDIA" tanpa jaminan dalam bentuk
                                apa pun, baik tersurat maupun tersirat. DramaboxWeb tidak menjamin bahwa:
                            </p>
                            <ul className="terms-list">
                                <li>Layanan akan selalu tersedia, tidak terputus, atau bebas dari kesalahan</li>
                                <li>Konten akan selalu akurat, lengkap, atau terkini</li>
                                <li>Kualitas layanan akan memenuhi harapan Anda</li>
                                <li>Kesalahan dalam layanan akan diperbaiki</li>
                            </ul>
                        </div>
                        <p>
                            Dalam keadaan apa pun, DramaboxWeb tidak bertanggung jawab atas kerugian langsung, tidak langsung,
                            insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>7. Konten Pihak Ketiga</h2>
                        <p>
                            Layanan kami mungkin berisi link ke situs web atau layanan pihak ketiga. Kami tidak bertanggung
                            jawab atas konten, kebijakan privasi, atau praktik dari situs pihak ketiga tersebut.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>8. Iklan dan Sponsor</h2>
                        <p>
                            DramaboxWeb dapat menampilkan iklan dan konten sponsor. Kami tidak bertanggung jawab atas produk
                            atau layanan yang diiklankan. Interaksi Anda dengan pengiklan adalah tanggung jawab Anda sendiri.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>9. Modifikasi Layanan</h2>
                        <p>
                            Kami berhak untuk:
                        </p>
                        <ul className="terms-list">
                            <li>Memodifikasi atau menghentikan layanan (atau bagian darinya) kapan saja</li>
                            <li>Mengubah Syarat dan Ketentuan ini dengan pemberitahuan</li>
                            <li>Menolak layanan kepada siapa pun karena alasan apa pun</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h2>10. Penghentian</h2>
                        <p>
                            Kami dapat menghentikan atau menangguhkan akses Anda ke layanan segera, tanpa pemberitahuan
                            sebelumnya atau tanggung jawab, karena alasan apa pun, termasuk jika Anda melanggar Syarat dan
                            Ketentuan ini.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>11. Hukum yang Berlaku</h2>
                        <p>
                            Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.
                            Setiap sengketa yang timbul akan diselesaikan di pengadilan yang berwenang di Indonesia.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>12. Pemisahan</h2>
                        <p>
                            Jika ada ketentuan dalam Syarat dan Ketentuan ini yang dianggap tidak dapat dilaksanakan atau
                            tidak sah, ketentuan tersebut akan diubah dan ditafsirkan untuk mencapai tujuan ketentuan tersebut
                            semaksimal mungkin, dan ketentuan lainnya akan tetap berlaku penuh.
                        </p>
                    </div>

                    <div className="info-card">
                        <h2>13. Keseluruhan Perjanjian</h2>
                        <p>
                            Syarat dan Ketentuan ini merupakan keseluruhan perjanjian antara kami mengenai Layanan kami,
                            dan menggantikan semua perjanjian sebelumnya yang mungkin ada antara kami.
                        </p>
                    </div>

                    <div className="contact-box">
                        <h3>📧 Pertanyaan tentang Syarat dan Ketentuan?</h3>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami:
                        </p>
                        <p><strong>Email:</strong> legal@dramaboxweb.com</p>
                        <p><strong>Terakhir Diperbarui:</strong> Januari 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
