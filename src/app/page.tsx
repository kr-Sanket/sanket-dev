import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";

// Placeholder homepage — the application shell is in place. Homepage sections
// (Hero, Featured Projects, Timeline, …) are assembled in a later milestone.
export default function Home() {
  return (
    <Container className="py-24">
      <SectionHeader
        eyebrow="sanket.dev"
        title="Application shell ready"
        description="The layout, navigation, and theming foundation is in place. Homepage sections will be assembled here in an upcoming milestone."
      />
    </Container>
  );
}
