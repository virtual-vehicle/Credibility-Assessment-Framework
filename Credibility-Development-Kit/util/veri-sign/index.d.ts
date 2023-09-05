export interface ExpertStatement {
    result: boolean;
    log: string;
    status_code: number;
}

export interface KeySpec {
    format: string;
    type?: string;
    isEncrypted: boolean;
    passphrase?: string
}

export interface ResultLog {
    result: boolean;
    log: string;
}

export interface SignedStatement {
    content: ExpertStatement;
    signature: string;
    hash_algorithm: string;
    signature_encoding: string;
}

export declare function checkExpertStatement(signedExpertStatement: SignedStatement, x509Certificate: string | Buffer): ResultLog;
export declare function sign(expertStatement: ExpertStatement, privateKey: string | object | Buffer, keySpecification: KeySpec): string;
export declare function verify(signedStatement: string, x509Certificate: string | Buffer): ResultLog;