import { useState, type FC } from 'react';
import { CreditCard, Banknote, Landmark, Copy, CheckCircle, Circle, QrCode } from 'lucide-react';

const OrderSummary = () => (
  <div className="w-full bg-slate-50 p-6 lg:p-8 rounded-xl border border-slate-200">
    <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
    <div className="space-y-4">
      <div className="flex justify-between items-center text-slate-600">
        <span>Pro Plan - Monthly</span>
        <span className="font-semibold text-slate-800">₹999.00</span>
      </div>
      <div className="flex justify-between items-center text-slate-600">
        <span>Taxes (18% GST)</span>
        <span className="font-semibold text-slate-800">₹179.82</span>
      </div>
    </div>
    <div className="w-full h-[1px] bg-slate-200 my-6"></div>
    <div className="flex justify-between items-center text-slate-900">
      <span className="text-lg font-bold">Total Amount</span>
      <span className="text-xl font-bold">₹1178.82</span>
    </div>
    <div className="mt-8 text-xs text-slate-500 text-center">
      <p>Your payment is processed securely. All card details are encrypted.</p>
    </div>
  </div>
);

const AutoPaymentSection = () => (
  <div className="mt-8 animate-fade-in">
    <h3 className="text-lg font-semibold text-slate-700 mb-1">Enter Card Details</h3>
    <p className="text-sm text-slate-500 mb-6">Your card will be charged automatically every month.</p>
    <form className="space-y-5">
      <div>
        <label htmlFor="card-number" className="block text-sm font-medium text-slate-600 mb-1">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            id="card-number"
            placeholder="0000 0000 0000 0000"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      <div>
        <label htmlFor="card-name" className="block text-sm font-medium text-slate-600 mb-1">
          Name on Card
        </label>
        <input
          type="text"
          id="card-name"
          placeholder="John Doe"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry-date" className="block text-sm font-medium text-slate-600 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            id="expiry-date"
            placeholder="MM / YY"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-slate-600 mb-1">
            CVC
          </label>
          <input
            type="password"
            id="cvc"
            placeholder="•••"
            maxLength={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
       <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Subscribe & Pay ₹1178.82
      </button>
    </form>
  </div>
);

const ManualPaymentSection = () => {
    const [manualTab, setManualTab] = useState<'bank' | 'upi'>('bank');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!");
        });
    };

    return (
        <div className="mt-8 animate-fade-in">
             <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => setManualTab('bank')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${manualTab === 'bank' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Landmark size={18} /> Bank Transfer
                </button>
                <button
                    onClick={() => setManualTab('upi')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${manualTab === 'upi' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <QrCode size={18} /> UPI / QR Code
                </button>
            </div>

            {manualTab === 'bank' && (
                <div className="space-y-6 animate-fade-in">
                    <p className="text-sm text-slate-500">Please transfer the total amount to the bank account below. After payment, enter the Transaction ID to confirm.</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Account Name:</span>
                            <span className="font-mono text-slate-800 font-medium">My Company Pvt. Ltd.</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-slate-600">Account Number:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-800 font-medium">123456789012</span>
                                <Copy size={16} className="text-slate-500 cursor-pointer hover:text-blue-600" onClick={() => copyToClipboard('123456789012')} />
                            </div>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-slate-600">IFSC Code:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-800 font-medium">BANK0001234</span>
                                <Copy size={16} className="text-slate-500 cursor-pointer hover:text-blue-600" onClick={() => copyToClipboard('BANK0001234')} />
                            </div>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-slate-600">Bank Name:</span>
                            <span className="font-mono text-slate-800 font-medium">ABC Bank</span>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="transaction-id" className="block text-sm font-medium text-slate-600 mb-1">
                            Transaction ID / UTR Number
                        </label>
                        <input
                            type="text"
                            id="transaction-id"
                            placeholder="Enter the UTR number here"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            )}
            
            {manualTab === 'upi' && (
                <div className="space-y-6 animate-fade-in text-center">
                    <p className="text-sm text-slate-500">Scan the QR code or use the UPI ID to make the payment.</p>
                    <div className="flex justify-center">
                       <div className="bg-white p-4 border rounded-lg shadow-sm inline-block">
                          <QrCode size={160} className="text-slate-800" />
                       </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-slate-100 p-3 rounded-lg">
                        <span className="text-slate-600">UPI ID:</span>
                        <span className="font-mono text-blue-600 font-bold">mypayment@okbank</span>
                        <Copy size={18} className="text-slate-500 cursor-pointer hover:text-blue-600" onClick={() => copyToClipboard('mypayment@okbank')} />
                    </div>
                     <div>
                        <label htmlFor="upi-transaction-id" className="block text-sm font-medium text-slate-600 mb-1 text-left">
                           UPI Transaction ID
                        </label>
                        <input
                            type="text"
                            id="upi-transaction-id"
                            placeholder="Enter 12-digit UPI reference number"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            )}
             <button
                type="submit"
                className="w-full mt-8 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
            >
                Confirm Payment
            </button>
        </div>
    );
};


const PaymentPage: FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'auto' | 'manual'>('auto');

  return (
    <main className="bg-slate-100 min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Complete Your Payment</h1>
            <p className="text-slate-500 mb-8">Choose a payment method below to finalize your order.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('auto')}
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'auto' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                       <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Automatic Payment</h3>
                      <p className="text-xs text-slate-500">Credit/Debit Card</p>
                    </div>
                  </div>
                  {paymentMethod === 'auto' ? <CheckCircle className="h-5 w-5 text-blue-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('manual')}
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'manual' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                       <Banknote className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">One-Time Payment</h3>
                      <p className="text-xs text-slate-500">Bank Transfer / UPI</p>
                    </div>
                  </div>
                  {paymentMethod === 'manual' ? <CheckCircle className="h-5 w-5 text-blue-500" /> : <Circle className="h-5 w-5 text-slate-300" />}
                </div>
              </div>
            </div>

            {paymentMethod === 'auto' ? <AutoPaymentSection /> : <ManualPaymentSection />}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary />
          </div>

        </div>
      </div>
    </main>
  );
};

export default PaymentPage;