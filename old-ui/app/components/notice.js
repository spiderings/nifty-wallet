const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const ReactMarkdown = require('react-markdown')
const linker = require('extension-link-enabler')
const findDOMNode = require('react-dom').findDOMNode

module.exports = Notice

inherits(Notice, Component)
function Notice () {
  Component.call(this)
}

Notice.prototype.render = function () {
  const { notice, onConfirm } = this.props
  const { title, body } = notice
  const state = this.state || { disclaimerDisabled: true }
  const disabled = state.disclaimerDisabled

  return (
    h('.flex-column.flex-center.flex-grow', {
      style: {
        width: '100%',
      },
    }, [
      h('h3.flex-center.terms-header.section-title', {
        style: {
          background: '#ffffff',
          color: '#333333',
          width: '100%',
          fontSize: '16px',
          textAlign: 'center',
          padding: 6,
          marginBottom: 24,
        },
      }, [
        title,
      ]),

      h('style', `

        .markdown {
          overflow-x: hidden;
        }

        .markdown h1, .markdown h2, .markdown h3 {
          margin: 10px 0;
          font-weight: bold;
        }

        .markdown strong {
          font-weight: bold;
        }
        .markdown em {
          font-style: italic;
        }

        .markdown p {
          margin: 10px 0;
        }

        .markdown a {
          color: #8fdc97;
        }

      `),

      h('div.markdown', {
        onScroll: (e) => {
          var object = e.currentTarget
          if (object.offsetHeight + object.scrollTop + 100 >= object.scrollHeight) {
            this.setState({disclaimerDisabled: false})
          }
        },
        style: {
          background: '#ffffff',
          height: '310px',
          padding: '6px',
          width: '90%',
          overflowY: 'scroll',
          scroll: 'auto',
          borderRadius: '3px',
        },
      }, [
        h(ReactMarkdown, {
          className: 'notice-box',
          source: body,
          skipHtml: true,
        }),
      ]),

      h('button', {
        disabled,
        onClick: () => {
          this.setState({disclaimerDisabled: true})
          onConfirm()
        },
        style: {
          marginTop: '18px',
        },
      }, 'Accept'),
    ])
  )
}

Notice.prototype.componentDidMount = function () {
  // eslint-disable-next-line react/no-find-dom-node
  var node = findDOMNode(this)
  linker.setupListener(node)
  if (document.getElementsByClassName('notice-box')[0].clientHeight < 310) {
    this.setState({disclaimerDisabled: false})
  }
}

Notice.prototype.componentWillUnmount = function () {
  // eslint-disable-next-line react/no-find-dom-node
  var node = findDOMNode(this)
  linker.teardownListener(node)
}
