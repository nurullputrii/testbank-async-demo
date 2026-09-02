// Single source of truth for user-facing strings in Bahasa Indonesia.
// Flat object: every value is a plain string. Look up with `id.<key>`.
export const id = {
  appTitle: 'Test Bank Digital',
  appIntro: 'Pilih rekening untuk melihat kuota transfer dan melakukan pembayaran tagihan.',
  accountsLoadError: 'Gagal memuat data rekening',

  accountsHeading: 'Daftar Rekening',
  accountNumberLabel: 'Nomor Rekening',
  accountTierLabel: 'Tipe Nasabah',
  accountBalanceLabel: 'Saldo',
  accountBranchLabel: 'Kantor Cabang',
  accountDetailButton: 'Lihat Detail',

  quotaHeading: 'Kuota Transfer Gratis',
  quotaPeriodLabel: 'Periode',
  quotaLimitLabel: 'Batas Bulanan',
  quotaUsedLabel: 'Sudah Terpakai',
  quotaRemainingLabel: 'Sisa Kuota',
  quotaTransactionUnit: 'transaksi',

  transferHeading: 'Hitung Biaya Transfer',
  transferAmountLabel: 'Nominal Transfer',
  transferAmountPlaceholder: 'Masukkan nominal',
  transferChannelLabel: 'Saluran Transaksi',
  transferChannelMobile: 'Mobile Banking',
  transferChannelInternet: 'Internet Banking',
  transferChannelAtm: 'ATM',
  transferChannelTeller: 'Teller Cabang',
  transferQuoteButton: 'Hitung Biaya',
  transferFeeLabel: 'Biaya Admin',
  transferTotalLabel: 'Total Debet',
  transferQuotaRemainingLabel: 'Sisa Kuota Gratis',

  billsHeading: 'Pembayaran Tagihan',
  billInquiryButton: 'Cek Tagihan',
  billCustomerNameLabel: 'Nama Pelanggan',
  billPeriodLabel: 'Periode Tagihan',
  billPeriodEmpty: 'Tidak ada periode',
  billAmountLabel: 'Jumlah Tagihan',
  billAdminFeeLabel: 'Biaya Admin',
  billStatusLabel: 'Status',

  billerElectricityTitle: 'Tagihan Listrik',
  billerElectricityCustomerRefLabel: 'Nomor Meter / ID Pelanggan',
  billerElectricityCustomerRefPlaceholder: 'Masukkan nomor meter',
  billerElectricityNotFound: 'Tagihan listrik tidak ditemukan',

  billerWaterTitle: 'Tagihan Air',
  billerWaterCustomerRefLabel: 'Nomor Pelanggan PDAM',
  billerWaterCustomerRefPlaceholder: 'Masukkan nomor pelanggan',
  billerWaterNotFound: 'Tagihan air tidak ditemukan',

  billerMobileTopupTitle: 'Isi Pulsa',
  billerMobileTopupCustomerRefLabel: 'Nomor Handphone',
  billerMobileTopupCustomerRefPlaceholder: 'Masukkan nomor handphone',
  billerMobileTopupNotFound: 'Nomor handphone tidak ditemukan',
};
