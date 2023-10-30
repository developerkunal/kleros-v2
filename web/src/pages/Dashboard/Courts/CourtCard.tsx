import React from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { Card as _Card, Breadcrumb } from "@kleros/ui-components-library";
import WithHelpTooltip from "../WithHelpTooltip";
import { isUndefined } from "utils/index";
import { useKlerosCoreGetJurorBalance } from "hooks/contracts/generated";

const Card = styled(_Card)`
  height: auto;
  width: 100%;
  padding: 12px 24px;
  border-left: 5px solid ${({ theme }) => theme.secondaryPurple};
`;

const ValueContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 12px;
`;

const tooltipMsg =
  "When a juror is selected to arbitrate a case, part of their stake (PNK) is " +
  "locked until the case is resolved. Jurors whose vote is coherent with the " +
  "final jury decision have their locked stake released. Jurors whose vote " +
  "is not coherent with the final jury decision, lose their locked stake. " +
  "The locked stake of incoherent jurors is redistributed as incentives for " +
  "the coherent jurors.";

interface ICourtCard {
  id: string;
  name: string;
}

const CourtCard: React.FC<ICourtCard> = ({ id, name }) => {
  const { address } = useAccount();
  const { data: jurorBalance } = useKlerosCoreGetJurorBalance({
    enabled: !isUndefined(address),
    args: [address!, BigInt(id)],
    watch: true,
  });

  const stake = jurorBalance?.[0] ?? BigInt(0);
  const lockedStake = jurorBalance?.[1] ?? BigInt(0);
  const formatedStake = formatUnits(stake, 18);
  const formatedLockedStake = formatUnits(lockedStake, 18);

  return stake > 0 || lockedStake > 0 ? (
    <Card>
      <StyledBreadcrumb items={[{ text: name, value: 0 }]} />
      <ValueContainer>
        <label> Stake: </label>
        <small>{`${formatedStake} PNK`}</small>
      </ValueContainer>
      <ValueContainer>
        <WithHelpTooltip {...{ place: "bottom", tooltipMsg }}>
          <label> Locked Stake: </label>
        </WithHelpTooltip>
        <small>{`${formatedLockedStake} PNK`}</small>
      </ValueContainer>
    </Card>
  ) : null;
};

export default CourtCard;
