export interface BrainRegion {
  id: string
  side: 'left' | 'right'
  title: string
  description: string
  color: string
  glowColor: string
  connections: string[]
  projectIds: string[]
  technologies: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  year: string
  company: string
  regionIds: string[]
  technologies: string[]
  links: {
    live?: string
    android?: string
    ios?: string
    github?: string
  }
}
