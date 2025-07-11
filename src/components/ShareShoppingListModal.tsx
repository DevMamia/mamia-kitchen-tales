import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Share, 
  Mail, 
  MessageCircle, 
  Copy, 
  QrCode, 
  Smartphone,
  Check,
  X
} from 'lucide-react';
import { sharingService } from '@/services/sharingService';
import { ShoppingListItem } from '@/types/shopping';
import { useToast } from '@/hooks/use-toast';

interface ShareShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingListItem[];
  listName?: string;
}

const ShareShoppingListModal: React.FC<ShareShoppingListModalProps> = ({
  isOpen,
  onClose,
  items,
  listName = 'My Shopping List'
}) => {
  const [showQR, setShowQR] = useState(false);
  const [shareFormat, setShareFormat] = useState<'simple' | 'detailed' | 'emoji'>('simple');
  const [includeChecked, setIncludeChecked] = useState(false);
  const { toast } = useToast();

  const shareOptions = {
    title: listName,
    includeCheckedItems: includeChecked,
    format: shareFormat
  };

  const handleNativeShare = async () => {
    const success = await sharingService.shareShoppingList(items, shareOptions);
    if (success) {
      toast({
        title: "Shared successfully",
        description: "Shopping list copied to clipboard",
      });
      onClose();
    } else {
      toast({
        title: "Share failed",
        description: "Unable to share the shopping list",
        variant: "destructive"
      });
    }
  };

  const handleEmailShare = () => {
    sharingService.shareViaEmail(items, shareOptions);
    onClose();
  };

  const handleSMSShare = () => {
    sharingService.shareViaSMS(items, shareOptions);
    onClose();
  };

  const handleWhatsAppShare = () => {
    sharingService.shareViaWhatsApp(items, shareOptions);
    onClose();
  };

  const handleCopyToClipboard = async () => {
    const success = await sharingService.shareShoppingList(items, shareOptions);
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "Shopping list is ready to paste",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const generateQRCode = () => {
    return sharingService.generateQRCode(items, shareOptions);
  };

  const uncheckedCount = items.filter(item => !item.checked).length;
  const checkedCount = items.filter(item => item.checked).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share size={20} />
            Share Shopping List
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* List Statistics */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-heading font-bold mb-2">{listName}</h3>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {uncheckedCount} to buy
              </Badge>
              {checkedCount > 0 && (
                <Badge variant="outline">
                  {checkedCount} completed
                </Badge>
              )}
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <div>
              <label className="font-heading font-bold text-sm mb-2 block">
                Share Format
              </label>
              <div className="flex gap-2">
                <Button
                  variant={shareFormat === 'simple' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareFormat('simple')}
                >
                  Simple
                </Button>
                <Button
                  variant={shareFormat === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareFormat('detailed')}
                >
                  Detailed
                </Button>
                <Button
                  variant={shareFormat === 'emoji' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShareFormat('emoji')}
                >
                  Emoji
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={includeChecked ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIncludeChecked(!includeChecked)}
                className="w-auto"
              >
                {includeChecked ? <Check size={16} /> : <X size={16} />}
                Include completed items
              </Button>
            </div>
          </div>

          {/* Share Methods */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="flex items-center gap-2 h-12"
            >
              <Share size={18} />
              Share
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 h-12"
            >
              <Copy size={18} />
              Copy
            </Button>

            <Button
              variant="outline"
              onClick={handleEmailShare}
              className="flex items-center gap-2 h-12"
            >
              <Mail size={18} />
              Email
            </Button>

            <Button
              variant="outline"
              onClick={handleSMSShare}
              className="flex items-center gap-2 h-12"
            >
              <Smartphone size={18} />
              SMS
            </Button>

            <Button
              variant="outline"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 h-12"
            >
              <MessageCircle size={18} />
              WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 h-12"
            >
              <QrCode size={18} />
              QR Code
            </Button>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="text-center space-y-3">
              <img
                src={generateQRCode()}
                alt="Shopping List QR Code"
                className="w-48 h-48 mx-auto border rounded-lg"
              />
              <p className="text-sm text-muted-foreground">
                Scan to view shopping list
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareShoppingListModal;