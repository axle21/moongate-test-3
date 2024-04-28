import { Button } from "@chakra-ui/react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { ReactNode, useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

const ConnectWalletButton = ({
  className: className = "",
  children,
  disabled,
  onClick: onClick = () => {},
  onSuccess: onSuccess = () => {},
  onError: onError = () => {},
}: {
  name?: string;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  onSuccess?: (message: SiweMessage, signature: string) => void;
  onError?: () => void;
}) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectModalOpen } = useConnectModal();
  const { disconnect } = useDisconnect();
  const [walletDialog, setWalletDialog] = useState<JSX.Element | null>(null);
  const [message, setMessage] = useState<SiweMessage | null>(null);
  const [nonce, setNonce] = useState("");
  const [showConfirmAddress, setShowConfirmAddress] = useState(false);
  const [active, setActive] = useState(false);

  const {
    data: signature,
    isSuccess: isSigned,
    error: signError,
    signMessage,
  } = useSignMessage();

  useEffect(() => {
    disconnect();
  }, []);

  const verifySignature = async (
    message: SiweMessage,
    signature: string,
    nonce: string
  ) => {
    try {
      await message.verify({
        signature,
        nonce,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const reset = () => {
    setShowConfirmAddress(false);
    setWalletDialog(null);
    setMessage(null);
    setNonce("");
  };

  const cancel = () => {
    reset();
    disconnect();
  };

  const handleSignMessage = async (
    address?: string
  ): Promise<SiweMessage | null> => {
    return null;
  };

  const handleOpenConnectModal = (
    connected: boolean,
    openConnectModal: () => void
  ) => {};

  return (
    <>
      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, mounted }) => {
          const ready = mounted;
          const connected = !!(ready && account && chain);
          return (
            <>
              <Button
                variant='ghost'
                className={"min-w-fit " + className}
                onClick={() => {
                  handleOpenConnectModal(
                    connected || isConnected,
                    openConnectModal
                  );
                }}
                isDisabled={disabled}
                isLoading={active && (isConnecting || !ready)}
                padding={0}>
                {children}
              </Button>
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
};

export default ConnectWalletButton;
