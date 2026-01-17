import React from 'react';
import { Shield, AlertTriangle, Mail, FileText } from 'lucide-react';
import './FooterPages.css';

const DMCA = () => {
    return (
        <div className="footer-page">
            <div className="container">
                <div className="page-hero">
                    <h1 className="page-title">⚖️ DMCA Policy</h1>
                    <p className="page-subtitle">
                        Digital Millennium Copyright Act Compliance
                    </p>
                </div>

                <div className="content-section">
                    <div className="info-card">
                        <Shield size={32} className="card-icon" />
                        <h2>Kebijakan Hak Cipta</h2>
                        <p>
                            DramaboxWeb menghormati hak kekayaan intelektual orang lain dan mengharapkan pengguna kami melakukan hal yang sama.
                            Sesuai dengan Digital Millennium Copyright Act (DMCA), kami akan merespons pemberitahuan pelanggaran hak cipta yang jelas
                            dan mengambil tindakan yang sesuai.
                        </p>
                    </div>

                    <div className="info-card">
                        <AlertTriangle size={32} className="card-icon" />
                        <h2>Pelaporan Pelanggaran</h2>
                        <p>
                            Jika Anda yakin bahwa konten di DramaboxWeb melanggar hak cipta Anda, silakan kirimkan pemberitahuan DMCA
                            yang berisi informasi berikut:
                        </p>
                        <ul className="dmca-list">
                            <li>Tanda tangan fisik atau elektronik dari pemilik hak cipta atau orang yang berwenang</li>
                            <li>Identifikasi karya berhak cipta yang diklaim telah dilanggar</li>
                            <li>Identifikasi materi yang diklaim melanggar dan informasi lokasi yang cukup</li>
                            <li>Informasi kontak Anda (alamat, nomor telepon, email)</li>
                            <li>Pernyataan bahwa Anda dengan itikad baik percaya bahwa penggunaan materi tidak diizinkan</li>
                            <li>Pernyataan bahwa informasi dalam pemberitahuan akurat dan Anda adalah pemilik hak cipta</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <Mail size={32} className="card-icon" />
                        <h2>Hubungi Agen DMCA Kami</h2>
                        <div className="contact-info">
                            <p><strong>Email:</strong> dmca@dramaboxweb.com</p>
                            <p><strong>Subject:</strong> DMCA Takedown Request</p>
                            <p><strong>Response Time:</strong> 24-48 jam</p>
                        </div>
                        <p className="note">
                            Harap dicatat bahwa pemberitahuan DMCA yang tidak lengkap atau tidak akurat mungkin tidak akan diproses.
                            Pemberitahuan palsu dapat mengakibatkan tanggung jawab hukum.
                        </p>
                    </div>

                    <div className="info-card">
                        <FileText size={32} className="card-icon" />
                        <h2>Counter-Notification</h2>
                        <p>
                            Jika Anda yakin bahwa konten Anda dihapus secara keliru atau salah identifikasi, Anda dapat mengajukan
                            counter-notification dengan informasi berikut:
                        </p>
                        <ul className="dmca-list">
                            <li>Tanda tangan fisik atau elektronik Anda</li>
                            <li>Identifikasi konten yang telah dihapus dan lokasi sebelumnya</li>
                            <li>Pernyataan di bawah sumpah bahwa konten dihapus karena kesalahan atau salah identifikasi</li>
                            <li>Nama, alamat, nomor telepon, dan pernyataan persetujuan yurisdiksi</li>
                        </ul>
                    </div>

                    <div className="disclaimer-box">
                        <h3>⚠️ Disclaimer</h3>
                        <p>
                            DramaboxWeb adalah platform agregator yang menyediakan link ke konten yang tersedia secara publik.
                            Kami tidak meng-host atau menyimpan file video apa pun di server kami. Semua konten disediakan oleh
                            pihak ketiga. Jika Anda memiliki masalah dengan konten tertentu, silakan hubungi penyedia konten asli.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DMCA;
