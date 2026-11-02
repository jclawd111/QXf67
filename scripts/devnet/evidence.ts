export function assertProgramFailure(error: unknown, instruction: number, code: number): void {
  const detail = typeof error === "object" && error !== null && "InstructionError" in error ? error.InstructionError : null;
  if (!Array.isArray(detail) || detail.length !== 2 || detail[0] !== instruction || typeof detail[1] !== "object" || detail[1] === null || detail[1].Custom !== code) {
    throw new Error(`Expected program rejection at instruction ${instruction}, code ${code}; received ${JSON.stringify(error)}`);
  }
}
