import React from "react"
import {
  NavItem,
  NavLink,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap"
import * as Icon from "react-feather"
import { Link } from "react-router-dom"
import classnames from "classnames"
import AutoComplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent"
import { history } from "../../../history"
import { connect } from "react-redux"
import {
  loadSuggestions,
  updateStarred
} from "../../../redux/actions/navbar/Index"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

// a little function to help us with reordering the bookmarks
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

class NavbarBookmarks extends React.PureComponent {
  state = {
    showBookmarks: false,
    value: "",
    noSuggestions: false,
    isStarred: false,
    suggestions: [],
    starredItems: [
        {target:'home',link:'/pages/home/main',title:'Home'},
        {target:'profile',link:'/app/user/view/main',title:'Profile'}
    ]
  }

  updateBookmarks = false

  handleBookmarksVisibility = () => {
    this.setState({
      showBookmarks: !this.state.showBookmarks,
      value: "",
      suggestions: [],
      noSuggestions: false,
      starred: null
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.bookmarks.starred.length !== this.state.starredItems.length && this.updateBookmarks === true) {
      // this.setState({ starredItems: this.props.bookmarks.starred })
      this.updateBookmarks = false
    }
  }

  componentDidMount() {
    let {
      bookmarks: { suggestions, starred },
      loadSuggestions
    } = this.props
    this.setState(
      {
        suggestions: suggestions,
      },
      loadSuggestions()
    )
  }

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const starredItems = reorder(
      this.state.starredItems,
      result.source.index,
      result.destination.index
    )

    this.setState({
      starredItems
    })
  }

  renderBookmarks = () => {
    this.updateBookmarks = true
    return <DragDropContext onDragEnd={this.onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="d-flex flex-sm-wrap flex-lg-nowrap draggable-cards"
          >
            {this.state.starredItems.map((item, index) => {
              const IconTag = Icon[item.icon ? item.icon : "X"]
              return (
                <Draggable key={item.target} draggableId={item.target} index={index}>
                  {(provided, snapshot) => {
                    return <div ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <NavItem className="nav-item d-none d-lg-block" style={{marginLeft:'30px'}}>
                        <NavLink
                          tag="span"
                          id={item.target}
                          className="nav-link cursor-pointer"
                          onClick={() => history.push(item.link)}

                        >
                          <h5 style={{marginBottom:0}}>{item.title}</h5>
                        </NavLink>
                      </NavItem>
                    </div>
                  }}

                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  }



  render() {
    let {
      bookmarks: { extraStarred, suggestions },
      sidebarVisibility,
      updateStarred,
      handleAppOverlay
    } = this.props

    const renderExtraStarred =
      extraStarred.length > 0
        ? extraStarred.map(i => {
          const IconTag = Icon[i.icon ? i.icon : null]
          return (
            <DropdownItem key={i.id} href={i.link}>
              <IconTag size={15} />
              <span className="align-middle ml-1">{i.title}</span>
            </DropdownItem>
          )
        })
        : null

    return (
      <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
        <ul className="nav navbar-nav bookmark-icons">
          {this.renderBookmarks()}
        </ul>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    bookmarks: state.navbar
  }
}

export default connect(mapStateToProps, { loadSuggestions, updateStarred })(
  NavbarBookmarks
)
