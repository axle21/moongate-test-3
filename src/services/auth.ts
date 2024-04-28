import { SiweMessage } from "siwe";

export const signingMessage = async (address: string, nonce: string) => {
    let statement = "Welcome to MOONGATE!\n\n";
    statement += `By signing, you accept the MOONGATE Terms of Service and Privacy Policy.`;
    statement +=
      "This request will not trigger a blockchain transaction or cost any gas fees.\n\n";

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement,
      uri: window.location.origin,
      version: "1",
      chainId: 1,
      nonce,
    });
    return message;
  };
