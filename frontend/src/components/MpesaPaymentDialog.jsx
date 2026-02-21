// src/components/MpesaPaymentDialog.jsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "@/lib/api"; // your axios instance - ensure baseURL + auth header used
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

const MpesaPaymentDialog = ({ ticketId, amount, onPaid }) => {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef(null);

  const startPolling = async (ticketIdToPoll, txId) => {
    let attempts = 0;
    const maxAttempts = 30; // ~2 minutes if interval 4s
    pollingRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const resp = await axios.get(`/mpesa/status/${ticketIdToPoll}`);
        const { status, mpesaReceipt } = resp.data;
        if (status === 'paid') {
          clearInterval(pollingRef.current);
          toast.success('Payment confirmed ✅');
          setOpen(false);
          if (typeof onPaid === 'function') onPaid(resp.data);
        } else if (status === 'failed') {
          clearInterval(pollingRef.current);
          toast.error('Payment failed ❌');
        } else {
          // still pending — you can show subtle toast or spinner
          console.debug('Payment pending...');
        }
      } catch (err) {
        console.error('poll error', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollingRef.current);
        toast('Payment still pending. You can check later or retry.', { icon: '⏳' });
      }
    }, 4000);
  };

  const handlePay = async () => {
    if (!phone.trim()) {
      toast.error('Please enter your Safaricom phone number (e.g. 0712xxxxxx)');
      return;
    }

    try {
      setLoading(true);
      // Fire the STK push via /api/mpesa/pay
      const res = await axios.post('/mpesa/pay', {
        ticketId,
        phone,
        amount
      });

      const { mpesaResponse, txId } = res.data;
      // Inform user to check phone
      toast.success(`STK push sent. Check ${phone} to complete payment for KES ${amount}.`);

      // Start polling payment status for the ticket
      startPolling(ticketId, txId);
    } catch (err) {
      console.error('initiate pay error', err);
      toast.error(err.response?.data?.message || 'Could not initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-gray-900">Pay with M-PESA</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Pay with M-PESA</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">Enter the Safaricom phone number to receive the STK Push.</p>
          <Input placeholder="e.g. 0712345678 or 254712345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handlePay} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-gray-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Send STK Push (KES ${amount})`}
            </Button>
            <Button variant="ghost" onClick={handleClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MpesaPaymentDialog;