// script.js
document.addEventListener('DOMContentLoaded', function () {

    // Helper function untuk mengambil nilai dari input, parse ke angka, dan validasi
    function getValue(id) {
        const inputElement = document.getElementById(id);
        if (!inputElement) {
            throw new Error(`Elemen dengan ID '${id}' tidak ditemukan.`);
        }
        // Jika input kosong, anggap sebagai NaN untuk memicu error
        if (inputElement.value === '') {
            throw new Error(`Input untuk ${inputElement.previousElementSibling.textContent} harus diisi.`);
        }
        const value = parseFloat(inputElement.value);
        if (isNaN(value)) {
            throw new Error(`Input untuk ${inputElement.previousElementSibling.textContent} harus berupa angka.`);
        }
        return value;
    }

    // Helper function untuk menampilkan hasil
    function setResult(resultSpanId, value, unit) {
        const resultElement = document.getElementById(resultSpanId);
        if (resultElement) {
            const resultContainer = resultElement.parentElement;
            const formattedValue = (value % 1 !== 0) ? value.toFixed(4) : value;
            resultElement.textContent = `${formattedValue} ${unit}`;
            resultContainer.className = 'result success';
        }
    }

    // Helper function untuk menampilkan error
    function setError(resultSpanId, message) {
        const resultElement = document.getElementById(resultSpanId);
        if (resultElement) {
            const resultContainer = resultElement.parentElement;
            resultElement.textContent = message;
            resultContainer.className = 'result error';
        }
    }
    
    // Menambahkan event listener ke semua tombol 'Hitung' menggunakan event delegation
    document.body.addEventListener('click', function (e) {
        // Cek apakah yang diklik adalah tombol hitung
        if (e.target.tagName !== 'BUTTON' || !e.target.id.startsWith('calc-')) return;
        
        // Mencegah form submit jika tombol ada di dalam form (meskipun di sini tidak ada form)
        e.preventDefault(); 
            
        const calculationType = e.target.id.substring(5); // Ambil tipe kalkulasi dari ID tombol
        const resultSpanId = 'res-' + calculationType;
            
        try {
            // Gunakan switch case untuk menangani setiap tombol
            switch (calculationType) {
                // --- Kecepatan Rata-rata ---
                case 'v':
                    const s_v = getValue('v-s');
                    const t_v = getValue('v-t');
                    if (t_v === 0) throw new Error("Waktu tidak boleh nol.");
                    setResult(resultSpanId, s_v / t_v, 'm/s');
                    break;
                case 's':
                    const v_s = getValue('s-v');
                    const t_s = getValue('s-t');
                    setResult(resultSpanId, v_s * t_s, 'meter');
                    break;
                case 't':
                    const s_t = getValue('t-s');
                    const v_t = getValue('t-v');
                    if (v_t === 0) throw new Error("Kecepatan tidak boleh nol.");
                    setResult(resultSpanId, s_t / v_t, 'detik');
                    break;
                
                // --- Jarak GLBB ---
                case 'glbb-s':
                    const v0_glbb = getValue('glbb-s-v0');
                    const t_glbb = getValue('glbb-s-t');
                    const a_glbb = getValue('glbb-s-a');
                    setResult(resultSpanId, (v0_glbb * t_glbb) + (0.5 * a_glbb * t_glbb * t_glbb), 'meter');
                    break;

                // --- Hukum II Newton ---
                case 'F':
                    const m_F = getValue('F-m');
                    const a_F = getValue('F-a');
                    if (m_F < 0) throw new Error("Massa tidak boleh negatif.");
                    setResult(resultSpanId, m_F * a_F, 'Newton');
                    break;
                case 'm-newton':
                    const F_m = getValue('m-F');
                    const a_m = getValue('m-a');
                    if (a_m === 0) throw new Error("Percepatan tidak boleh nol.");
                    setResult(resultSpanId, F_m / a_m, 'kg');
                    break;
                case 'a-newton':
                    const F_a = getValue('a-F');
                    const m_a = getValue('a-m');
                    if (m_a === 0) throw new Error("Massa tidak boleh nol.");
                    setResult(resultSpanId, F_a / m_a, 'm/s²');
                    break;

                // --- Energi Potensial ---
                case 'Ep':
                    const m_Ep = getValue('Ep-m');
                    const g_Ep = getValue('Ep-g');
                    const h_Ep = getValue('Ep-h');
                    if (m_Ep < 0) throw new Error("Massa tidak boleh negatif.");
                    setResult(resultSpanId, m_Ep * g_Ep * h_Ep, 'Joule');
                    break;
                case 'm-potensial':
                    const Ep_m = getValue('m-Ep');
                    const g_m = getValue('m-g-potensial');
                    const h_m = getValue('m-h-potensial');
                    if (Ep_m < 0) throw new Error("Energi tidak boleh negatif.");
                    if ((g_m * h_m) === 0) throw new Error("Gravitasi & Ketinggian tidak boleh nol.");
                    setResult(resultSpanId, Ep_m / (g_m * h_m), 'kg');
                    break;
                case 'h':
                    const Ep_h = getValue('h-Ep');
                    const m_h = getValue('h-m-potensial');
                    const g_h = getValue('h-g-potensial');
                    if (Ep_h < 0 || m_h <= 0) throw new Error("Energi harus positif & massa > 0.");
                    if ((m_h * g_h) === 0) throw new Error("Massa & Gravitasi tidak boleh nol.");
                    setResult(resultSpanId, Ep_h / (m_h * g_h), 'meter');
                    break;

                // --- Energi Kinetik ---
                case 'Ek':
                    const m_Ek = getValue('Ek-m');
                    const v_Ek_kin = getValue('Ek-v');
                    if (m_Ek < 0) throw new Error("Massa tidak boleh negatif.");
                    setResult(resultSpanId, 0.5 * m_Ek * v_Ek_kin * v_Ek_kin, 'Joule');
                    break;
                case 'm-kinetik':
                    const Ek_m_kin = getValue('m-Ek-kinetik');
                    const v_m_kin = getValue('m-v-kinetik');
                    if (Ek_m_kin < 0) throw new Error("Energi tidak boleh negatif.");
                    if (v_m_kin === 0) throw new Error("Kecepatan tidak boleh nol.");
                    setResult(resultSpanId, (2 * Ek_m_kin) / (v_m_kin * v_m_kin), 'kg');
                    break;
                case 'v-kinetik':
                    const Ek_v_kin = getValue('v-Ek');
                    const m_v_kin = getValue('v-m-kinetik');
                    if (Ek_v_kin < 0 || m_v_kin <= 0) throw new Error("Energi harus positif & massa > 0.");
                    setResult(resultSpanId, Math.sqrt((2 * Ek_v_kin) / m_v_kin), 'm/s');
                    break;

                // --- Daya ---
                case 'P':
                    const W_P = getValue('P-W');
                    const t_P = getValue('P-t');
                    if (t_P === 0) throw new Error("Waktu tidak boleh nol.");
                    setResult(resultSpanId, W_P / t_P, 'Watt');
                    break;
                case 'W':
                    const P_W = getValue('W-P');
                    const t_W = getValue('W-t');
                    setResult(resultSpanId, P_W * t_W, 'Joule');
                    break;
                case 't-daya':
                    const W_t = getValue('t-W-daya');
                    const P_t = getValue('t-P-daya');
                    if (P_t === 0) throw new Error("Daya tidak boleh nol.");
                    setResult(resultSpanId, W_t / P_t, 'detik');
                    break;

                // --- Hukum Ohm ---
                case 'V':
                    const I_V = getValue('V-I');
                    const R_V = getValue('V-R');
                    setResult(resultSpanId, I_V * R_V, 'Volt');
                    break;
                case 'I':
                    const V_I = getValue('I-V');
                    const R_I = getValue('I-R');
                    if (R_I === 0) throw new Error("Hambatan tidak boleh nol.");
                    setResult(resultSpanId, V_I / R_I, 'Ampere');
                    break;
                case 'R':
                    const V_R = getValue('R-V');
                    const I_R = getValue('R-I');
                    if (I_R === 0) throw new Error("Arus tidak boleh nol.");
                    setResult(resultSpanId, V_R / I_R, 'Ohm');
                    break;
            }
        } catch (error) {
            // Menangkap error dari getValue atau dari validasi manual
            const resultSpanId = 'res-' + e.target.id.substring(5);
            setError(resultSpanId, error.message);
        }
    });
});