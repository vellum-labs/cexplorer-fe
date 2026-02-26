import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import "../../mocks/useAppTranslation";
import "../../mocks/router";

vi.mock("lucide-react", () => ({
  ExternalLink: () => <span data-testid="ExternalLink" />,
  UserMinus: () => <span data-testid="UserMinus" />,
  UserPlus: () => <span data-testid="UserPlus" />,
  Calendar: () => <span />,
}));


vi.mock("@vellumlabs/cexplorer-sdk", () => ({
  GlobalTable: (props: any) => (
    <div
      data-testid="GlobalTable"
      data-itemcount={props.items?.length ?? 0}
    >
      {props.items?.map((item: any, i: number) => (
        <div
          key={i}
          data-testid="table-row"
          data-rowtype={item.type}
          data-expiration={String(item.expiration_epoch ?? "null")}
          data-txhash={item.record?.hash ?? ""}
          data-time={item.record?.time ?? ""}
          data-epochno={String(item.record?.epoch_no ?? "null")}
        />
      ))}
    </div>
  ),
  DateCell: () => <span />,
  EpochCell: () => <span />,
}));

import { CCMemberStatusHistoryTab } from "@/components/gov/cc/tabs/CCMemberStatusHistoryTab";
import type {
  CommitteeMember,
  CommitteeMemberRegistration,
} from "@/types/governanceTypes";


const makeReg = (
  time: string,
  hash: string,
  epoch_no = 500,
): CommitteeMemberRegistration => ({
  hash,
  time,
  index: 0,
  epoch_no,
  invalid_hereafter: null,
  treasury_donation: 0,
});

const makeMember = (overrides: Partial<CommitteeMember> = {}): CommitteeMember => ({
  ident: { raw: "abc123", has_script: false, cold: "cc_cold1abc", hot: "cc_hot1abc" },
  registry: { img: "", name: "Test Member" },
  registration: null,
  de_registration: null,
  expiration_epoch: 550,
  ...overrides,
});


describe("CCMemberStatusHistoryTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  
  it("shows 0 rows when memberHistory is undefined", () => {
    render(<CCMemberStatusHistoryTab memberHistory={undefined} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("0");
  });

  it("shows 0 rows when memberHistory is an empty array", () => {
    render(<CCMemberStatusHistoryTab memberHistory={[]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("0");
  });

  it("shows 0 rows when member has no registration or de_registration", () => {
    render(<CCMemberStatusHistoryTab memberHistory={[makeMember()]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("0");
  });

  
  it("shows 1 row for a single registration", () => {
    const member = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash_reg"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("1");
  });

  it("row type is 'registration' for a registration record", () => {
    const member = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash_reg"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    const row = screen.getByTestId("table-row");
    expect(row.getAttribute("data-rowtype")).toBe("registration");
    expect(row.getAttribute("data-txhash")).toBe("hash_reg");
  });

 
  it("shows 1 row for a single de_registration", () => {
    const member = makeMember({
      de_registration: makeReg("2024-06-01T00:00:00Z", "hash_dereg"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("1");
  });

  it("row type is 'de_registration' for a de-registration record", () => {
    const member = makeMember({
      de_registration: makeReg("2024-06-01T00:00:00Z", "hash_dereg"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    const row = screen.getByTestId("table-row");
    expect(row.getAttribute("data-rowtype")).toBe("de_registration");
    expect(row.getAttribute("data-txhash")).toBe("hash_dereg");
  });

  
  it("shows 2 rows when member has both registration and de_registration", () => {
    const member = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash_reg"),
      de_registration: makeReg("2024-06-01T00:00:00Z", "hash_dereg"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("2");
  });

 
  it("handles an array of registrations (member re-elected)", () => {
    const member = makeMember({
      registration: [
        makeReg("2023-01-01T00:00:00Z", "hash_reg1"),
        makeReg("2024-01-01T00:00:00Z", "hash_reg2"),
      ],
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("2");
    const rows = screen.getAllByTestId("table-row");
    expect(rows.every(r => r.getAttribute("data-rowtype") === "registration")).toBe(true);
  });

  it("handles an array of de_registrations", () => {
    const member = makeMember({
      de_registration: [
        makeReg("2024-03-01T00:00:00Z", "hash_dereg1"),
        makeReg("2024-09-01T00:00:00Z", "hash_dereg2"),
      ],
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("2");
  });

 
  it("combines rows from multiple members (committee history)", () => {
    const member1 = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash_m1_reg"),
    });
    const member2 = makeMember({
      registration: makeReg("2024-03-01T00:00:00Z", "hash_m2_reg"),
      de_registration: makeReg("2024-06-01T00:00:00Z", "hash_m2_dereg"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member1, member2]} isLoading={false} />);
    expect(screen.getByTestId("GlobalTable").getAttribute("data-itemcount")).toBe("3");
  });

 
  it("sorts rows newest first (de_registration appears before earlier registration)", () => {
    const member = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash_old"),
      de_registration: makeReg("2024-12-01T00:00:00Z", "hash_new"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    const rows = screen.getAllByTestId("table-row");
    expect(rows[0].getAttribute("data-txhash")).toBe("hash_new");
    expect(rows[1].getAttribute("data-txhash")).toBe("hash_old");
  });

  it("sorts multiple members' rows in reverse chronological order", () => {
    const member1 = makeMember({
      registration: makeReg("2023-06-01T00:00:00Z", "hash_2023"),
    });
    const member2 = makeMember({
      registration: makeReg("2024-06-01T00:00:00Z", "hash_2024"),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member1, member2]} isLoading={false} />);
    const rows = screen.getAllByTestId("table-row");
    expect(rows[0].getAttribute("data-txhash")).toBe("hash_2024");
    expect(rows[1].getAttribute("data-txhash")).toBe("hash_2023");
  });

  
  it("passes expiration_epoch from member to each row", () => {
    const member = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash1"),
      expiration_epoch: 600,
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("table-row").getAttribute("data-expiration")).toBe("600");
  });

  it("passes null expiration_epoch when member has none", () => {
    const member = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash1"),
      expiration_epoch: null,
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("table-row").getAttribute("data-expiration")).toBe("null");
  });

 
  it("passes epoch_no from registration record to the row", () => {
    const member = makeMember({
      registration: makeReg("2024-01-01T00:00:00Z", "hash1", 523),
    });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("table-row").getAttribute("data-epochno")).toBe("523");
  });

  it("exposes null epoch_no when registration has no epoch_no", () => {
    const regWithoutEpoch: import("@/types/governanceTypes").CommitteeMemberRegistration = {
      hash: "hash_no_epoch",
      time: "2024-01-01T00:00:00Z",
      index: 0,
      invalid_hereafter: null,
      treasury_donation: 0,
    };
    const member = makeMember({ registration: regWithoutEpoch });
    render(<CCMemberStatusHistoryTab memberHistory={[member]} isLoading={false} />);
    expect(screen.getByTestId("table-row").getAttribute("data-epochno")).toBe("null");
  });

  
  it("renders GlobalTable even in loading state", () => {
    render(<CCMemberStatusHistoryTab memberHistory={undefined} isLoading={true} />);
    expect(screen.getByTestId("GlobalTable")).toBeInTheDocument();
  });
});
