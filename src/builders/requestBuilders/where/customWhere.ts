import Expr from './where';

export default class CustomWhere extends Expr {
  public constructor(private custom: string) {
    super();
  }

  public toQuery = (): string => this.custom;
}
