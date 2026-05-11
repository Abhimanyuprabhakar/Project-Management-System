import { SearchIcon, PanelLeft, FolderOpen, CheckSquare, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../features/themeSlice'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// Highlights matched text in a string
const Highlight = ({ text = '', query = '' }) => {
    if (!query.trim()) return <span>{text}</span>
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part)
                    ? <mark key={i} className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded px-0.5">{part}</mark>
                    : <span key={i}>{part}</span>
            )}
        </span>
    )
}

const Navbar = ({ setIsSidebarOpen }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { theme } = useSelector(state => state.theme)
    const currentWorkspace = useSelector(state => state?.workspace?.currentWorkspace || null)

    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)

    // Build flat list of searchable results from Redux
    const results = useMemo(() => {
        if (!query.trim() || !currentWorkspace) return []
        const q = query.toLowerCase()
        const items = []

        currentWorkspace.projects?.forEach(project => {
            // Match projects
            if (
                project.name?.toLowerCase().includes(q) ||
                project.description?.toLowerCase().includes(q)
            ) {
                items.push({
                    type: 'project',
                    id: project.id,
                    title: project.name,
                    subtitle: project.description || project.status,
                    href: `/projectsDetail?id=${project.id}&tab=tasks`,
                })
            }
            // Match tasks inside this project
            project.tasks?.forEach(task => {
                if (
                    task.title?.toLowerCase().includes(q) ||
                    task.description?.toLowerCase().includes(q)
                ) {
                    items.push({
                        type: 'task',
                        id: task.id,
                        title: task.title,
                        subtitle: `${project.name} · ${task.status?.replace('_', ' ')}`,
                        href: `/taskDetails?projectId=${task.projectId}&taskId=${task.id}`,
                    })
                }
            })
        })

        return items.slice(0, 8) // cap at 8 results
    }, [query, currentWorkspace])

    const handleSelect = (item) => {
        navigate(item.href)
        setQuery('')
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
    }

    const handleKeyDown = (e) => {
        if (!isOpen) return
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(i => Math.min(i + 1, results.length - 1))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(i => Math.max(i - 1, 0))
        } else if (e.key === 'Enter') {
            e.preventDefault()
            if (activeIndex >= 0 && results[activeIndex]) handleSelect(results[activeIndex])
        } else if (e.key === 'Escape') {
            setIsOpen(false)
            setQuery('')
            inputRef.current?.blur()
        }
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Reset active index when results change
    useEffect(() => { setActiveIndex(-1) }, [results])

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800" >
                        <PanelLeft size={20} />
                    </button>

                    {/* Brand Logo */}
                    <span className="hidden sm:flex items-center gap-1.5 font-bold text-lg tracking-tight select-none">
                        <span className="bg-gradient-to-br from-blue-500 to-violet-600 text-white rounded-md px-1.5 py-0.5 text-sm font-extrabold">M</span>
                        <span className="text-gray-900 dark:text-white">ManageX</span>
                    </span>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5 pointer-events-none" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            placeholder="Search projects, tasks..."
                            autoComplete="off"
                            onChange={e => { setQuery(e.target.value); setIsOpen(true) }}
                            onFocus={() => { if (query) setIsOpen(true) }}
                            onKeyDown={handleKeyDown}
                            className="pl-8 pr-8 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        {query && (
                            <button onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus() }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200">
                                <X size={14} />
                            </button>
                        )}

                        {/* Dropdown */}
                        {isOpen && query.trim() && (
                            <div ref={dropdownRef} className="absolute top-full left-0 mt-1.5 w-full min-w-[320px] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                {results.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-zinc-500">
                                        No results for &ldquo;<span className="font-medium text-gray-600 dark:text-zinc-300">{query}</span>&rdquo;
                                    </div>
                                ) : (
                                    <ul className="py-1 max-h-72 overflow-y-auto">
                                        {results.map((item, i) => (
                                            <li
                                                key={item.id}
                                                onMouseDown={() => handleSelect(item)}
                                                onMouseEnter={() => setActiveIndex(i)}
                                                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${activeIndex === i ? 'bg-blue-50 dark:bg-blue-950/40' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                                            >
                                                <div className={`flex-shrink-0 p-1.5 rounded-md ${item.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'}`}>
                                                    {item.type === 'project'
                                                        ? <FolderOpen size={14} />
                                                        : <CheckSquare size={14} />
                                                    }
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate">
                                                        <Highlight text={item.title} query={query} />
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-zinc-500 truncate mt-0.5">{item.subtitle}</p>
                                                </div>
                                                <span className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-wide flex-shrink-0">
                                                    {item.type}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="px-3 py-1.5 border-t border-gray-100 dark:border-zinc-800 flex items-center gap-3 text-[10px] text-gray-400 dark:text-zinc-600">
                                    <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px]">↑↓</kbd> navigate</span>
                                    <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px]">Enter</kbd> select</span>
                                    <span><kbd className="px-1 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-[10px]">Esc</kbd> close</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button onClick={() => dispatch(toggleTheme())} className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95">
                        {theme === "light"
                            ? (<MoonIcon className="size-4 text-gray-800 dark:text-gray-200" />)
                            : (<SunIcon className="size-4 text-yellow-400" />)
                        }
                    </button>

                    {/* User Button Mock */}
                    <img src="https://i.pravatar.cc/150" alt="User avatar" className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-700" />
                </div>
            </div>
        </div>
    )
}

export default Navbar
