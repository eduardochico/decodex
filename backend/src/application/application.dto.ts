export class CreateApplicationDto {
  name!: string;
  repository!: string;
  gitUrl!: string;
  language!: string;
}

export class UpdateApplicationDto {
  name?: string;
  repository?: string;
  gitUrl?: string;
  language?: string;
  status?: 'ok' | 'error' | 'warning';
}
