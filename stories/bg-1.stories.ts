import "../src/components/bg1"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Button',
  tags: ['autodocs'],
  render: () => `<bg-1 instances="10" palette="#508991 #74B3CE #004346 #09BC8A" background="#172A3A">
    <h2> Well Hello There</h2>
  </bg-1>`,
}

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {},
};