/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { ValidationResult, BlobRef } from '@atproto/lexicon'
import { lexicons } from '../../../../lexicons'
import { isObj, hasProp } from '../../../../util'
import { CID } from 'multiformats/cid'

export interface ProjectMeta {
  title: string
  description: string
  [k: string]: unknown
}

export function isProjectMeta(v: unknown): v is ProjectMeta {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'land.evex.atratch.defs#projectMeta'
  )
}

export function validateProjectMeta(v: unknown): ValidationResult {
  return lexicons.validate('land.evex.atratch.defs#projectMeta', v)
}

export interface ProjectView {
  meta: ProjectMeta
  /** key-value pair of md5 keys and asset URL values. */
  assetMap: {}
  /** project.json */
  projectJson: {}
  like: number
  [k: string]: unknown
}

export function isProjectView(v: unknown): v is ProjectView {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'land.evex.atratch.defs#projectView'
  )
}

export function validateProjectView(v: unknown): ValidationResult {
  return lexicons.validate('land.evex.atratch.defs#projectView', v)
}

export interface ViewerState {
  like?: string
  [k: string]: unknown
}

export function isViewerState(v: unknown): v is ViewerState {
  return (
    isObj(v) &&
    hasProp(v, '$type') &&
    v.$type === 'land.evex.atratch.defs#viewerState'
  )
}

export function validateViewerState(v: unknown): ValidationResult {
  return lexicons.validate('land.evex.atratch.defs#viewerState', v)
}
