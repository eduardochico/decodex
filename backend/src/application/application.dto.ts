export class CreateApplicationDto {
  name!: string;
  repository!: string;
  gitUrl!: string;
}

export class UpdateApplicationDto {
  name?: string;
  repository?: string;
  gitUrl?: string;
  status?: 'ok' | 'error' | 'warning';
}
