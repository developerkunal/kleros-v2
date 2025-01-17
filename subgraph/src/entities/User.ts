import { BigInt } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";
import { ONE, ZERO } from "../utils";

export function ensureUser(id: string): User {
  const user = User.load(id);

  if (user) {
    return user;
  }

  return createUserFromAddress(id);
}

export function createUserFromAddress(id: string): User {
  const user = new User(id);
  user.totalStake = ZERO;
  user.totalDelayed = ZERO;
  user.activeDisputes = ZERO;
  user.disputes = [];
  user.rounds = [];
  user.resolvedDisputes = [];
  user.totalResolvedDisputes = ZERO;
  user.totalAppealingDisputes = ZERO;
  user.totalDisputes = ZERO;
  user.totalCoherent = ZERO;
  user.save();

  return user;
}

export function addUserActiveDispute(id: string, disputeID: string): void {
  const user = ensureUser(id);
  if (user.disputes.includes(disputeID)) {
    return;
  }
  user.disputes = user.disputes.concat([disputeID]);
  user.activeDisputes = user.activeDisputes.plus(ONE);
  user.totalDisputes = user.totalDisputes.plus(ONE);
  user.save();
}

export function resolveUserDispute(id: string, previousFeeAmount: BigInt, feeAmount: BigInt, disputeID: string): void {
  const user = ensureUser(id);
  if (user.resolvedDisputes.includes(disputeID)) {
    if (previousFeeAmount.gt(ZERO)) {
      if (feeAmount.le(ZERO)) {
        user.totalCoherent = user.totalCoherent.minus(ONE);
      }
    } else if (previousFeeAmount.le(ZERO)) {
      if (feeAmount.gt(ZERO)) {
        user.totalCoherent = user.totalCoherent.plus(ONE);
      }
    }
    user.save();
    return;
  }
  user.resolvedDisputes = user.resolvedDisputes.concat([disputeID]);
  user.totalResolvedDisputes = user.totalResolvedDisputes.plus(ONE);
  if (feeAmount.gt(ZERO)) {
    user.totalCoherent = user.totalCoherent.plus(ONE);
  }
  user.activeDisputes = user.activeDisputes.minus(ONE);
  user.save();
}
