import React from 'react';
import { ChevronDown } from 'lucide-react';
import './FooterPages.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = React.useState(null);

    const faqs = [
        {
            question: "Apa itu DramaboxWeb?",
            answer: "DramaboxWeb adalah platform streaming premium yang menyediakan koleksi lengkap drama China berkualitas tinggi. Kami menawarkan pengalaman menonton yang seamless dengan subtitle dan dubbing Indonesia."
        },
        {
            question: "Apakah DramaboxWeb gratis?",
            answer: "Ya, DramaboxWeb menyediakan akses gratis ke berbagai konten drama. Kami juga menawarkan fitur premium untuk pengalaman menonton yang lebih baik tanpa iklan dan akses early release."
        },
        {
            question: "Bagaimana cara menonton drama?",
            answer: "Cukup browse koleksi kami, pilih drama yang Anda inginkan, dan klik episode yang ingin ditonton. Tidak perlu registrasi untuk menonton konten gratis."
        },
        {
            question: "Apakah ada subtitle Indonesia?",
            answer: "Ya, sebagian besar drama kami dilengkapi dengan subtitle Indonesia berkualitas tinggi. Beberapa drama juga tersedia dengan sulih suara (dubbing) Indonesia."
        },
        {
            question: "Seberapa sering konten baru ditambahkan?",
            answer: "Kami menambahkan konten baru setiap hari. Kunjungi halaman 'Latest' untuk melihat drama-drama terbaru yang baru saja kami tambahkan."
        },
        {
            question: "Apakah bisa menonton di mobile?",
            answer: "Tentu saja! DramaboxWeb dioptimalkan untuk semua perangkat - desktop, tablet, dan smartphone. Anda bisa menonton kapan saja, di mana saja."
        },
        {
            question: "Bagaimana cara menyimpan drama favorit?",
            answer: "Klik tombol 'Add to My List' pada halaman detail drama. Anda bisa mengakses semua drama favorit Anda di menu 'My List'."
        },
        {
            question: "Kualitas video apa yang tersedia?",
            answer: "Kami menyediakan berbagai kualitas video dari 480p hingga 1080p Full HD, yang akan menyesuaikan secara otomatis dengan kecepatan internet Anda."
        },
        {
            question: "Apakah bisa download drama untuk ditonton offline?",
            answer: "Fitur download sedang dalam pengembangan dan akan segera tersedia untuk pengguna premium."
        },
        {
            question: "Bagaimana cara melaporkan masalah atau bug?",
            answer: "Jika Anda menemukan masalah teknis atau bug, silakan hubungi kami melalui halaman kontak atau kirim email ke support@dramaboxweb.com"
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="footer-page">
            <div className="container">
                <div className="page-hero">
                    <h1 className="page-title">❓ Frequently Asked Questions</h1>
                    <p className="page-subtitle">
                        Temukan jawaban untuk pertanyaan yang sering diajukan
                    </p>
                </div>

                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'active' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <ChevronDown
                                    size={20}
                                    className={`faq-icon ${openIndex === index ? 'rotate' : ''}`}
                                />
                            </button>
                            <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="contact-section">
                    <h2>Masih punya pertanyaan?</h2>
                    <p>Jangan ragu untuk menghubungi kami di <a href="mailto:support@dramaboxweb.com">support@dramaboxweb.com</a></p>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
