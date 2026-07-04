"use client";

import { Accordion, AccordionItem, Tabs, TabList, Tab, TabPanel } from "namps-ui";
import { PageHeader, Example, PropsTable } from "@/components/namps-ui/Doc";

export default function Disclosure() {
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Disclosure"
        lede="Progressive disclosure patterns — accordions for stacked panels, tabs for switching views."
      />

      <h2>Accordion</h2>
      <p className="muted">
        <code className="doc__inline-code">type=&quot;single&quot;</code> (default) collapses others;{" "}
        <code className="doc__inline-code">&quot;multiple&quot;</code> allows many open at once.
      </p>
      <Example
        layout="block"
        code={`<Accordion defaultValue="a">
  <AccordionItem value="a" title="How is usage metered?">
    Usage is measured per input and output token across every request.
  </AccordionItem>
  <AccordionItem value="b" title="Can I rotate API keys?">
    Yes — create a new key, migrate traffic, then revoke the old one.
  </AccordionItem>
  <AccordionItem value="c" title="Where is data stored?">
    Requests are processed in your selected region and are not used for training.
  </AccordionItem>
</Accordion>`}
      >
        <div style={{ width: "100%" }}>
          <Accordion defaultValue="a">
            <AccordionItem value="a" title="How is usage metered?">
              Usage is measured per input and output token across every request. Live counts appear in
              the Usage tab, and quotas reset on the first of each month.
            </AccordionItem>
            <AccordionItem value="b" title="Can I rotate API keys?">
              Yes — create a new key, migrate traffic, then revoke the old one. Revoked keys stop
              working immediately and cannot be restored.
            </AccordionItem>
            <AccordionItem value="c" title="Where is data stored?">
              Requests are processed in your selected region and are not used for training. Logs are
              retained for 30 days, then deleted.
            </AccordionItem>
          </Accordion>
        </div>
      </Example>

      <h2>Tabs</h2>
      <Example
        layout="block"
        code={`<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="activity">Activity</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>
  <TabPanel value="overview">A snapshot of your workspace health.</TabPanel>
  <TabPanel value="activity">Recent events appear here.</TabPanel>
  <TabPanel value="settings">Manage workspace defaults.</TabPanel>
</Tabs>`}
      >
        <div
          style={{
            width: "100%",
            border: "1px solid var(--pui-border)",
            borderRadius: "var(--pui-radius-lg)",
            overflow: "hidden",
          }}
        >
          <Tabs defaultValue="overview">
            <TabList>
              <Tab value="overview">Overview</Tab>
              <Tab value="activity">Activity</Tab>
              <Tab value="settings">Settings</Tab>
            </TabList>
            <TabPanel value="overview">
              A snapshot of your workspace health — request volume, error rate, and spend trend over the
              last 30 days.
            </TabPanel>
            <TabPanel value="activity">
              Recent events: keys created, members invited, and quota thresholds crossed appear here in
              reverse-chronological order.
            </TabPanel>
            <TabPanel value="settings">
              Manage workspace name, default region, model defaults, and danger-zone actions.
            </TabPanel>
          </Tabs>
        </div>
      </Example>

      <h2>Props</h2>
      <PropsTable
        rows={[
          { name: "Accordion.type", type: '"single" | "multiple"', def: '"single"', desc: "Whether opening one closes the rest." },
          { name: "Accordion.defaultValue", type: "string | string[]", desc: "Initially open item value(s)." },
          { name: "AccordionItem.value / title", type: "string / ReactNode", desc: "Unique id and trigger label." },
          { name: "Tabs.defaultValue", type: "string", desc: "Initially active tab (uncontrolled)." },
          { name: "Tabs.value / onValueChange", type: "string / fn", desc: "Controlled mode." },
          { name: "Tab.value / TabPanel.value", type: "string", desc: "Matching ids link a tab to its panel." },
        ]}
      />
    </>
  );
}
