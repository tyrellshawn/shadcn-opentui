# Contributing to Shadcn OpenTUI Terminal Component

Thank you for your interest in contributing to the Shadcn OpenTUI Terminal Component! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and Terminal UIs

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/shadcn-opentui.git
   cd shadcn-opentui
   \`\`\`
3. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
4. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
5. **Open** [http://localhost:3000](http://localhost:3000) to see the app

## 🎯 How to Contribute

### Reporting Issues

When reporting bugs, please use our [Bug Report template](https://github.com/tyrellshawn/shadcn-opentui/issues/new?assignees=&labels=bug%2Ctriage&projects=&template=bug_report.yml) which will guide you through providing:

- Clear description of the problem and expected behavior
- Steps to reproduce the issue
- Environment details (React/Next.js version, browser, OS, Node.js version)
- Minimal code reproduction
- Additional context like screenshots or error messages

Before creating an issue, please:
- Search existing issues to avoid duplicates
- Check our documentation for known solutions
- Ensure you're using the latest version of shadcn-opentui

### Suggesting Features

We welcome feature suggestions! Please use our [Feature Request template](https://github.com/tyrellshawn/shadcn-opentui/issues/new?assignees=&labels=enhancement%2Ctriage&projects=&template=feature_request.yml) which will help you provide:

- Problem statement and proposed solution
- Use cases and benefits for the community
- Component type (Terminal, Interactive Element, etc.)
- Priority level and estimated complexity
- API design ideas (optional)
- Alternative solutions you've considered

Before submitting a feature request:
- Search existing feature requests to avoid duplicates
- Check our documentation to ensure the feature doesn't already exist
- Consider if you'd be interested in contributing the implementation

### Issue Template Guidelines

Our issue templates are designed to gather the information needed for effective triage and resolution:

- **Complete all required fields** - this helps maintainers understand and prioritize your issue
- **Provide minimal reproductions** - include CodeSandbox, StackBlitz, or code snippets that demonstrate the issue
- **Be specific about your environment** - version numbers, browser details, and OS information help identify compatibility issues
- **Use clear, descriptive titles** - this helps other users find similar issues
- **Add relevant labels** - our templates will auto-assign appropriate labels for initial triage

Quality issue reports help us:
- Reproduce problems faster
- Understand user needs better
- Prioritize work effectively
- Provide better support to the community

### Code Contributions

#### Types of Contributions Welcome

- **Bug fixes**: Fix existing issues
- **New features**: Add terminal commands, UI components, or OpenTUI integrations
- **Documentation**: Improve docs, add examples, or fix typos
- **Performance**: Optimize rendering, reduce bundle size, or improve UX
- **Testing**: Add tests for components or fix existing test issues

#### Development Workflow

1. **Create a branch** for your feature/fix:
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes** following our coding standards:
   - Use TypeScript for type safety
   - Follow existing code style and patterns
   - Add JSDoc comments for public APIs
   - Ensure responsive design works on all screen sizes

3. **Test your changes**:
   \`\`\`bash
   npm run build
   npm run lint
   \`\`\`

4. **Commit your changes** with a clear message:
   \`\`\`bash
   git commit -m "feat: add new terminal command for file operations"
   \`\`\`

5. **Push to your fork**:
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

6. **Create a Pull Request** with:
   - Clear title and description
   - Screenshots/GIFs for UI changes
   - Link to related issues
   - Test instructions

## 📝 Coding Standards

### Code Style

- **TypeScript**: Use strict TypeScript with proper typing
- **Components**: Follow React best practices and hooks patterns
- **Styling**: Use Tailwind CSS classes, follow shadcn/ui patterns
- **Naming**: Use descriptive names for variables, functions, and components

### File Structure

\`\`\`
components/
├── ui/                 # Core UI components
│   ├── terminal.tsx    # Main terminal component
│   └── terminal-*.tsx  # Terminal-related components
├── docs/              # Documentation components
└── examples/          # Example implementations

app/
├── docs/              # Documentation pages
│   ├── components/    # Component documentation
│   ├── examples/      # Interactive examples
│   └── opentui/       # OpenTUI integration docs
└── api/               # API routes (registry, etc.)
\`\`\`

### Component Guidelines

- **Props**: Use TypeScript interfaces for component props
- **State**: Use React hooks for state management
- **Events**: Handle keyboard and mouse events properly
- **Accessibility**: Include ARIA labels and keyboard navigation
- **Performance**: Optimize re-renders and memory usage

### Terminal-Specific Guidelines

- **Commands**: Add new commands to the terminal's command registry
- **UI Mode**: Ensure components work in both command and UI modes
- **Keyboard**: Support standard terminal keyboard shortcuts
- **Styling**: Maintain terminal aesthetic with monospace fonts and appropriate colors

## 🧪 Testing

### Manual Testing

- Test on different screen sizes (mobile, tablet, desktop)
- Verify keyboard navigation works properly
- Check both light and dark themes
- Test terminal commands and interactive features

### Automated Testing

We encourage adding tests for:
- Component rendering and props
- Terminal command execution
- Keyboard event handling
- State management

## 📚 Documentation

### Adding Documentation

- **Component docs**: Add to `/app/docs/components/`
- **Examples**: Add to `/app/docs/examples/`
- **API docs**: Update component prop interfaces
- **README**: Update feature lists and usage examples

### Documentation Standards

- Use clear, concise language
- Include code examples with syntax highlighting
- Add interactive demos when possible
- Keep examples practical and realistic

## 🎨 Design Guidelines

### Visual Consistency

- Follow shadcn/ui design patterns
- Use consistent spacing and typography
- Maintain terminal aesthetic (monospace, green accents)
- Ensure proper contrast ratios for accessibility

### Interactive Elements

- Provide clear hover and focus states
- Use appropriate cursor styles
- Add smooth transitions where appropriate
- Ensure touch-friendly sizing on mobile

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Notes

- Document all changes in release notes
- Include migration guides for breaking changes
- Highlight new features and improvements
- Credit contributors

## 💬 Community

### Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community chat
- **Pull Requests**: Code review and collaboration

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Celebrate diverse perspectives

## 🙏 Recognition

Contributors are recognized in:
- README acknowledgments
- Release notes
- GitHub contributor graphs
- Special thanks in documentation

## 📞 Getting Help

Need help contributing? Reach out through:
- **GitHub Issues**: For specific problems
- **GitHub Discussions**: For general questions
- **Documentation**: Check our comprehensive docs

Thank you for contributing to make terminal interfaces more accessible and powerful for everyone! 🚀
