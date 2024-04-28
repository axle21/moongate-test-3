import { Button } from "@chakra-ui/react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { ReactNode, useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

const ConnectWalletButton = ({
  className = "",
  children,
  disabled,
  onClick = () => {},
  onSuccess = () => {},
  onError = () => {},
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

  const verifySignature = async (
    message: SiweMessage,
    signature: string,
    nonce: string
  ): Promise<boolean> => {
    try {
      await message.verify({
        signature,
        nonce,
      });
      return true; // Verification successful
    } catch (error) {
      console.error("Verification failed:", error);
      return false; // Verification failed
    }
  };

  const {
    data: signature,
    isSuccess: isSigned,
    error: signError,
    signMessage,
  } = useSignMessage();

  useEffect(() => {
    if (isSigned && message && signature) {
      verifySignature(message, signature, nonce).then((verified) => {
        if (verified) {
          onSuccess(message, signature);
        } else {
          onError();
        }
      });
    }
  }, [isSigned, message, signature, onSuccess, onError]);

  const handleSignMessage = async (): Promise<SiweMessage | null> => {
    if (!address) return null;

    const newNonce = Math.floor(Math.random() * 1000000).toString();
    setNonce(newNonce);
    const newMessage = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Please sign this message to confirm your identity.",
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce: newNonce,
    });

    setMessage(newMessage);
    signMessage({ message: newMessage.prepareMessage() });
    return newMessage;
  };

  const handleOpenConnectModal = (
    connected: boolean,
    openConnectModal: () => void
  ) => {
    if (!connected) {
      openConnectModal();
    } else {
      handleSignMessage();
    }
  };

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
                  onClick();
                  handleOpenConnectModal(
                    connected || isConnected,
                    openConnectModal
                  );
                }}
                isDisabled={disabled}
                isLoading={active && (!ready || isConnecting)}
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
